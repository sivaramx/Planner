import { create } from "zustand";

export interface PlanxUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface StoredUser extends PlanxUser {
  passwordHash: string;
}

interface AuthStore {
  users: StoredUser[];
  user: PlanxUser | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (patch: Partial<Pick<PlanxUser, "name" | "email">>) => void;
}

const USERS_KEY = "planx-users-v1";
const SESSION_KEY = "planx-session-v1";

const readUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
};
const readSession = (): PlanxUser | null => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
};
const saveUsers = (users: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const uid = () => globalThis.crypto?.randomUUID?.() || `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function hashPassword(password: string) {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(unescape(encodeURIComponent(password)));
}

const initialUsers = readUsers();
const initialSession = readSession();

export const useAuthStore = create<AuthStore>((set: any) => ({
  users: initialUsers,
  user: initialSession,
  loading: false,
  error: "",
  login: async (email: string, password: string) => {
    set({loading:true,error:""});
    const users = readUsers();
    const match = users.find((u: StoredUser) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!match || match.passwordHash !== await hashPassword(password)) {
      set({loading:false,error:"Incorrect email or password."});
      return false;
    }
    const user = {id:match.id,name:match.name,email:match.email,role:match.role,createdAt:match.createdAt};
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({users,user,loading:false});
    return true;
  },
  register: async (name: string, email: string, password: string) => {
    set({loading:true,error:""});
    const users = readUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail || password.length < 6) {
      set({loading:false,error:"Enter a name, a valid email and a password with at least 6 characters."});
      return false;
    }
    if (users.some((u: StoredUser) => u.email.toLowerCase() === cleanEmail)) {
      set({loading:false,error:"An account with this email already exists."});
      return false;
    }
    const stored: StoredUser = {id:uid(),name:name.trim(),email:cleanEmail,role:"user",createdAt:new Date().toISOString(),passwordHash:await hashPassword(password)};
    const next=[...users,stored];
    saveUsers(next);
    const user:PlanxUser={id:stored.id,name:stored.name,email:stored.email,role:stored.role,createdAt:stored.createdAt};
    localStorage.setItem(SESSION_KEY,JSON.stringify(user));
    set({users:next,user,loading:false});
    return true;
  },
  logout: () => { localStorage.removeItem(SESSION_KEY); set({user:null,error:""}); },
  clearError: () => set({error:""}),
  updateProfile: (patch: Partial<Pick<PlanxUser, "name" | "email">>) => set((s: AuthStore) => {
    if (!s.user) return s;
    const email = patch.email?.trim().toLowerCase() || s.user.email;
    const duplicate = s.users.some((u: StoredUser) => u.id !== s.user!.id && u.email.toLowerCase() === email);
    if (duplicate) return {...s,error:"That email is already used by another account."};
    const user = {...s.user, ...patch, name:patch.name?.trim() || s.user.name, email};
    const users=s.users.map((u: StoredUser)=>u.id===user.id?{...u,name:user.name,email:user.email}:u);
    saveUsers(users); localStorage.setItem(SESSION_KEY,JSON.stringify(user));
    return {users,user,error:""};
  })
}));
