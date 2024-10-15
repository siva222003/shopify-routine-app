import { withZod } from "@rvf/zod";
import { z } from "zod";

export const addRoutineValidator = withZod(
  z.object({
    routineName: z.string().min(5, {
      message: "Routine must be at least 5 characters long",
    }),
    category: z.string({ message: "Category is required" }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters long",
    }),
    duration: z.coerce
      .number({
        required_error: "Duration is required",
      })
      .min(1, {
        message: "Duration must be at least 1",
      }),
    unit: z.string({ message: "Unit is required" }),
    draft: z.string().optional(),
  }),
);
