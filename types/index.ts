export type Plan = "free" | "pro";
export type Platform = "ios" | "android" | "web";
export type DeliverableType = "link" | "note" | "file";
export type ChecklistCategory = "store_prep" | "aso" | "creative" | "legal";
export type ContentSource = "contentful" | "fallback";
export type ExportFormat = "pdf" | "markdown";

export interface User {
  id: string;
  email: string;
  plan: Plan;
  created_at: string;
  updated_at?: string;
}

export interface App {
  id: string;
  user_id: string;
  name: string;
  platform: Platform;
  launch_date: string;
  created_at: string;
  updated_at?: string;
}

export interface ChecklistItemStatus {
  id: string;
  app_id: string;
  cms_item_id: string;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  app_id: string;
  cms_item_id: string;
  type: DeliverableType;
  content: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
}

export interface RoutineLog {
  id: string;
  app_id: string;
  cms_task_id: string;
  week_number: number;
  completed: boolean;
  logged_at: string;
}

export interface CmsToolLink {
  label: string;
  url: string;
}

export interface CmsChecklistItem {
  id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  guideText: string;
  toolLinks: CmsToolLink[];
  order: number;
}

export interface CmsRoutineTask {
  id: string;
  title: string;
  description: string;
  frequency: "weekly";
  order: number;
}

export interface ChecklistItemWithStatus extends CmsChecklistItem {
  status: ChecklistItemStatus | null;
  deliverables: Deliverable[];
}

export interface RoutineTaskWithLog extends CmsRoutineTask {
  log: RoutineLog | null;
}

export interface WorkspaceProgress {
  overall: number;
  byCategory: Record<ChecklistCategory, number>;
  completedCount: number;
  totalCount: number;
}

export interface ChecklistWorkspace {
  app: App | null;
  items: ChecklistItemWithStatus[];
  progress: WorkspaceProgress;
  contentSource: ContentSource;
}

export interface RoutineWorkspace {
  app: App | null;
  tasks: RoutineTaskWithLog[];
  weekNumber: number;
  completedCount: number;
  totalCount: number;
  contentSource: ContentSource;
}

export interface AuthActionResult {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "confirmPassword" | "captchaToken", string>>;
}

export interface AppLimitState {
  plan: Plan;
  appCount: number;
  canCreateApp: boolean;
  remainingSlots: number | null;
}

export interface AppActionResult {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  app?: App;
  apps?: App[];
  limit?: AppLimitState;
  fieldErrors?: Partial<Record<"name" | "platform" | "launchDate", string>>;
}

export interface ChecklistActionResult {
  ok: boolean;
  message?: string;
  status?: ChecklistItemStatus;
  fieldErrors?: Partial<Record<"completed", string>>;
}

export interface DeliverableActionResult {
  ok: boolean;
  message?: string;
  deliverable?: Deliverable;
  deliverables?: Deliverable[];
  fieldErrors?: Partial<Record<"type" | "content" | "file", string>>;
}

export interface RoutineActionResult {
  ok: boolean;
  message?: string;
  log?: RoutineLog;
  fieldErrors?: Partial<Record<"taskId" | "weekNumber" | "completed", string>>;
}
