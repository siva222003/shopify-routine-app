import { withZod } from "@rvf/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const routineSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long",
  }),
  image: z.string(),
  category: z.string({ message: "Select one category" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  duration: z.object({
    number: z.string().min(1, {
      message: "Duration must be at least 1",
    }),
    unit: z.string({ message: "Select one unit" }),
  }),
  channel: zfd.repeatable(
    z.array(z.string()).min(1, {
      message: "Select at least one channel",
    }),
  ),
  draft: z.string(),
  visibility: z.enum(["Public", "Private"], {
    message: "Select one visibility",
  }),
});

export const addRoutineValidator = withZod(routineSchema);

export type DefaultRoutine = z.infer<typeof routineSchema>;
