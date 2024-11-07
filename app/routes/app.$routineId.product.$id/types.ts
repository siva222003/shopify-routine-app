import { ProductReminderType } from "../app.$id.add-product/validator";

export type EditProductReminderType = Omit<
  ProductReminderType,
  "timeSlotsConsumable" | "timeSlotsAppBased"
> & {
  timeSlotsConsumable: {
    meal: "" | "Breakfast" | "Brunch" | "Lunch" | "Dinner";
    time: string;
    timing: "beforeMeal" | "afterMeal";
  }[];
  timeSlotsAppBased: {
    time: string;
    timing: "beforeMeal" | "afterMeal";
  }[];
};

export type EditProductReminderResponseType = {
  success: boolean;
  data: EditProductReminderType;
};
