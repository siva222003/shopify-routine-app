import { withZod } from "@rvf/zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const timeSlotsConsumable = z.object({
  meal: z.enum(["Breakfast", "Brunch", "Lunch", "Dinner", ""], {
    message: "Select meal type",
  }),
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
  timing: z.enum(["beforeMeal", "afterMeal"], {
    message: "Select meal time",
  }),
});

const timeSlotsAppBased = z.object({
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
  timing: z.enum(["beforeMeal", "afterMeal"], {
    message: "Select meal time",
  }),
});

const addProductSchema = z
  .object({
    name: z.string({ message: "Product Name is missing" }).min(1, {
      message: "Product Name is missing",
    }),
    image: z.string({ message: "Product Image is required" }).min(1, {
      message: "Product Image is required",
    }),
    productId: z.string({ message: "Product ID is missing" }).min(1, {
      message: "Product ID is missing",
    }),
    variationId: z.string({ message: "Variant ID is missing" }).min(1, {
      message: "Variant ID is missing",
    }),
    productType: z.string({ message: "Product Type is required" }),
    dosageQty: z.string().min(1, { message: "Dosage Quantity is required" }),
    dosageUnit: z.string().min(1, { message: "Dosage Unit is required" }),
    duration: z.object({
      number: z.string().min(1, { message: "Duration must be at least 1" }),
      unit: z.string({ message: "Select one unit" }),
    }),
    // Define timeSlots as optional
    timeSlotsConsumable: z.array(timeSlotsConsumable).optional(),
    timeSlotsAppBased: z.array(timeSlotsAppBased).optional(),
    frequency: zfd.repeatable(
      z.array(z.string()).min(1, {
        message: "Select at least one channel",
      }),
    ),
  })
  .superRefine(
    ({ productType, timeSlotsConsumable, timeSlotsAppBased }, ctx) => {
      if (
        productType === "consumable" &&
        (!timeSlotsConsumable || timeSlotsConsumable.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "timeSlotsConsumable is required for consumable products",
          path: ["timeSlotsConsumable"],
        });
      }

      if (
        productType === "app_based" &&
        (!timeSlotsAppBased || timeSlotsAppBased.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "timeSlotsAppBased is required for app-based products",
          path: ["timeSlotsAppBased"],
        });
      }
    },
  );

export const addProductValidator = withZod(addProductSchema);

export type ProductReminderType = z.infer<typeof addProductSchema>;
