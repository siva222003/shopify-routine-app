import { withZod } from "@rvf/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

// Schema for individual weekly benefit
const weeklyBenefitSchema = z.object({
  weekRange: z
    .string()
    .regex(/^\d+-\d+$/, { message: "Week range must be in 'X-Y' format" }),
  benefits: zfd.repeatable(
    z
      .array(
        z
          .string()
          .regex(/^.+:\s.+/, {
            message:
              "Each benefit must have a phrase followed by a colon and then some text, e.g., 'Benefit: some text'",
          })
          .min(1, {
            message: "Benefit is required",
          }),
      )
      .min(1, {
        message: "Add at least one benefit",
      }),
  ),
});

// Main schema
export const benfitsSchema = z.object({
  totalWeeks: z
    .string({ required_error: "Total weeks are required" })
    .min(1, { message: "Select at least one week interval" }),
  weeklyBenefits: zfd.repeatable(z.array(weeklyBenefitSchema)),
});

export const benfitsValidator = withZod(benfitsSchema);

export type WeeklyBenefitsType = z.infer<typeof benfitsSchema>;
