import { z } from "zod";

import { checklistMessages } from "@/lib/checklist/messages";

export const checklistStatusSchema = z.object({
  completed: z.boolean({
    invalid_type_error: checklistMessages.invalidState,
    required_error: checklistMessages.invalidState
  })
});

export type ChecklistStatusInput = z.infer<typeof checklistStatusSchema>;
