import { withZod } from "@rvf/zod";
import { z } from "zod";

export const addProductValidator = withZod(
  z.object({
    description: z
      .string({ message: "Description is required" })
      .min(5, { message: "Description must be at least 5 characters long" }),
    dosageQty: z.coerce
      .number({
        required_error: "Dosage is required",
      })
      .min(1, {
        message: "Dosage Quantity must be at least 1",
      }),
    dosageUnit: z.string({ message: "Unit is required" }),
  }),
);
