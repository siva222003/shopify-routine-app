import { withZod } from "@rvf/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const timeslotActivityBasedSchema = z.object({
  hours: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, { message: "Hours must be in 01-12 format" })
    .length(2, { message: "Hours are required and must be in 2-digit format" }),
  minutes: z
    .string()
    .regex(/^[0-5][0-9]$/, { message: "Minutes must be in 00-59 format" })
    .length(2, {
      message: "Minutes are required and must be in 2-digit format",
    }),
  timeUnit: z.enum(["AM", "PM"], { message: "Select AM or PM" }),
});

const addActivitySchema = z.object({
  name: z.string({ message: "Activity Name is missing" }).min(5, {
    message: "Activity Name must be at least 5 characters",
  }),
  image: z.string(),
  activityType: z.string({ message: "Activity Type is required" }),
  goal: z.string().min(1, { message: "Goal is required" }),
  unit: z.string().min(1, { message: "Goal Unit is required" }),
  duration: z.object({
    number: z.string().min(1, { message: "Duration must be at least 1" }),
    unit: z.string({ message: "Select one unit" }),
  }),

  timeslotActivityBased: z.array(timeslotActivityBasedSchema),
  frequency: zfd.repeatable(
    z.array(z.string()).min(1, {
      message: "Select at least one channel",
    }),
  ),
});

export const addActivityValidator = withZod(addActivitySchema);

export type ActivityReminderType = z.infer<typeof addActivitySchema>;
