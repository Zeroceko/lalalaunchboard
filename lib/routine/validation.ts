import { z } from "zod";

import { routineMessages } from "@/lib/routine/messages";

export const routineLogSchema = z.object({
  taskId: z.string().trim().min(1, routineMessages.invalidState),
  weekNumber: z.coerce
    .number()
    .int(routineMessages.invalidWeek)
    .min(1, routineMessages.invalidWeek)
    .max(53, routineMessages.invalidWeek),
  completed: z.boolean()
});

export type RoutineLogInput = z.infer<typeof routineLogSchema>;
