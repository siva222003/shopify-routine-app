import { DefaultProductReminderValues } from "../app.$id.add-product/helper";
import { ProductReminderType } from "../app.$id.add-product/validator";
import { EditProductReminderType } from "./types";

export const EditProductReminderDefaultValues = (
  data: EditProductReminderType | null,
) => {
  if (!data) {
    return DefaultProductReminderValues;
  }

  return {
    name: data.name,
    image: data.image,
    productId: data.productId,
    variationId: data.variationId,
    productType: data.productType,
    dosageQty: data.dosageQty,
    dosageUnit: data.dosageUnit,
    duration: {
      number: data.duration.number.toString(),
      unit: data.duration.unit,
    },
    frequency: data.frequency,
    timeSlotsConsumable:
      data.timeSlotsConsumable.length > 0
        ? data.timeSlotsConsumable.map((slot) => {
            const [timePart, timeUnit] = slot.time.split(" ");
            const [hours, minutes] = timePart.split(":");

            return {
              meal: slot.meal,
              hours,
              minutes,
              timeUnit,
              timing: slot.timing,
            };
          })
        : DefaultProductReminderValues.timeSlotsConsumable,
    timeSlotsAppBased:
      data.timeSlotsAppBased.length > 0
        ? data.timeSlotsAppBased.map((slot) => {
            const [timePart, timeUnit] = slot.time.split(" ");
            const [hours, minutes] = timePart.split(":");

            return {
              hours,
              minutes,
              timeUnit,
              timing: slot.timing,
            };
          })
        : DefaultProductReminderValues.timeSlotsAppBased,
  } as ProductReminderType;
};
