export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "done";
export type Theme = "light" | "dark" | "system";
export type ProjectStatus = "planning" | "active" | "paused" | "completed" | "archived";

export interface Subtask { id:string; title:string; completed:boolean; }
export interface RecurrenceRule {
  type:"none"|"daily"|"weekdays"|"weekly"|"monthly"|"custom";
  interval?:number; daysOfWeek?:number[]; dayOfMonth?:number; endDate?:string;
}
export interface Task {
  id:string; title:string; description:string; completed:boolean; priority:Priority;
  categoryId:string; projectId?:string; dueDate?:string; dueTime?:string;
  durationMinutes?:number; reminderMinutes?:number; repeatRule?:RecurrenceRule;
  tags:string[]; subtasks:Subtask[]; notes:string; createdAt:string; updatedAt:string;
  completedAt?:string; order:number; status:TaskStatus; archived:boolean;
}
export interface Category { id:string; name:string; icon:string; }
export interface Project {
  id:string; name:string; description:string; categoryId:string; status:ProjectStatus;
  startDate?:string; deadline?:string; createdAt:string; updatedAt:string; archived:boolean;
}
export interface GoalMilestone { id:string; title:string; completed:boolean; }
export interface Goal {
  id:string; title:string; description:string; deadline?:string; progress:number;
  milestones:GoalMilestone[]; createdAt:string; updatedAt:string; status:"active"|"completed"|"archived";
}
export interface Habit {
  id:string; name:string; description:string; frequency:"daily"|"weekly";
  completedDates:string[]; streak:number; createdAt:string;
}
export interface Note {
  id:string; title:string; content:string; tags:string[]; linkedTaskId?:string;
  linkedProjectId?:string; createdAt:string; updatedAt:string; pinned:boolean; archived:boolean;
}
export interface AppData {
  tasks:Task[]; projects:Project[]; goals:Goal[]; habits:Habit[]; notes:Note[];
  categories:Category[]; theme:Theme; onboardingComplete:boolean;
  settings:{compact:boolean; animations:boolean; notifications:boolean; deadlineReminders:boolean; dailySummary:boolean; weekStartsOn:0|1; defaultPriority:Priority; defaultCategory:string};
}
