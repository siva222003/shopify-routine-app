import { withZod } from "@rvf/zod";
import { z } from "zod";

export const addProductValidator = withZod(
  z.object({
    time: z.string().min(1, {
      message: "Time is required",
    }),
  }),
);

export const addRoutineValidator = withZod(
  z.object({
    routineName: z.string().min(5, {
      message: "Routine must be at least 5 characters long",
    }),
    category: z.string().min(6, {
      message: "Category must be at least 6 characters long",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters long",
    }),
    duration: z.string().min(1, {
      message: "Duration is required",
    }),
    unit: z.string().min(1, {
      message: "Unit is required",
    }),
    channels: z.array(z.string()).min(1, {
      message: "Channels are required",
    }),
  }),
);
