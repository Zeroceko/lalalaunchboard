import { z } from "zod";

import { workspaceMessages } from "@/lib/workspaces/messages";

export const createWorkspaceSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, workspaceMessages.companyNameRequired)
    .max(100, workspaceMessages.companyNameTooLong),
  website_url: z
    .string()
    .trim()
    .url(workspaceMessages.websiteUrlInvalid)
    .optional()
    .or(z.literal("")),
  company_stage: z.string().optional(),
  team_size: z.string().optional(),
  industry: z.string().optional(),
  business_model: z.string().optional(),
  target_audience: z.string().optional(),
  primary_platform: z.array(z.string()).optional(),
  traction_level: z.string().optional(),
  revenue_level: z.string().optional(),
  growth_channel: z.string().optional(),
  compliance: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  uvp: z.string().max(280).optional()
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
