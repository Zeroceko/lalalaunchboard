export type Plan = "free" | "pro";
export type Platform = "ios" | "android" | "web";
export type DeliverableType = "link" | "note" | "file";
export type ChecklistCategory = "store_prep" | "aso" | "creative" | "legal";
export type ContentSource = "contentful" | "fallback";
export type ExportFormat = "pdf" | "markdown";
export type RoleInCompany = "Founder" | "Growth" | "Product" | "Marketing";
export type CompanyStage = "Pre-launch" | "MVP" | "Seed" | "Series A";
export type BusinessModel = "B2B SaaS" | "B2C Mobile" | "Marketplace" | "E-commerce";
export type MonetizationType = "Subscription" | "In-App Purchase" | "Ads" | "One-time";
export type AgeRating = "4+" | "9+" | "12+" | "17+";

export interface User {
  id: string;
  email: string;
  plan: Plan;
  full_name?: string;
  role_in_company?: RoleInCompany;
  created_at: string;
  updated_at?: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  company_name?: string;
  website_url?: string;
  company_stage?: string;
  team_size?: string;
  industry?: string;
  business_model?: string;
  target_audience?: string;
  primary_platform?: string[];
  traction_level?: string;
  revenue_level?: string;
  growth_channel?: string;
  compliance?: string[];
  competitors?: string[];
  uvp?: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  workspace_id: string;
  product_name: string;
  business_model?: BusinessModel;
  monetization_type?: MonetizationType[];
  target_audience?: string;
  primary_platform?: Platform[];
  launch_date: string;
  // Extended per-product context fields
  industry?: string;
  company_stage?: string;
  compliance?: string[];
  uvp?: string;
  competitors?: string[];
  created_at: string;
  updated_at?: string;
}

export interface AppStoreMetadata {
  id: string;
  product_id: string;
  primary_category?: string;
  secondary_category?: string;
  main_competitors?: string[];
  target_keywords?: string[];
  core_value_proposition?: string;
  requires_user_login?: boolean;
  collects_user_data?: boolean;
  has_account_deletion?: boolean;
  uses_external_payments?: boolean;
  target_age_rating?: AgeRating;
  created_at: string;
  updated_at?: string;
}

/** @deprecated Use Product instead */
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
  product_id?: string;
  cms_item_id: string;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  app_id: string;
  product_id?: string;
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
  product_id?: string;
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

export interface ProductLimitState {
  plan: Plan;
  productCount: number;
  canCreateProduct: boolean;
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

export interface ProductActionResult {
  ok: boolean;
  message?: string;
  redirectTo?: string;
  product?: Product;
  products?: Product[];
  limit?: ProductLimitState;
  fieldErrors?: Partial<Record<"product_name" | "primary_platform" | "launch_date" | "business_model" | "target_audience", string>>;
}

export interface WorkspaceActionResult {
  ok: boolean;
  message?: string;
  workspace?: Workspace;
  fieldErrors?: Partial<Record<"company_name" | "website_url" | "company_stage" | "team_size", string>>;
}

export interface UserProfileActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<"full_name" | "role_in_company", string>>;
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
