import { ProductReminderType } from "./validator";

export const formattedConsumableTimeslots = (
  data: ProductReminderType["timeSlotsConsumable"] = [],
) => {
  const timeSlots = data.map((item) => {
    // Format hours and minutes to two-digit format
    const hours = item.hours.padStart(2, "0");
    const minutes = item.minutes.padStart(2, "0");

    // Create the "time" key
    const time = `${hours}:${minutes} ${item.timeUnit}`;

    // Return a new object with only the necessary fields
    return {
      meal: item.meal,
      timing: item.timing,
      time,
    };
  });

  return timeSlots ?? [];
};

export const formattedAppBasedTimeslots = (
  data: ProductReminderType["timeSlotsAppBased"] = [],
) => {
  const timeSlots = data.map((item) => {
    // Format hours and minutes to two-digit format
    const hours = item.hours.padStart(2, "0");
    const minutes = item.minutes.padStart(2, "0");

    // Create the "time" key
    const time = `${hours}:${minutes} ${item.timeUnit}`;

    // Return a new object with only the necessary fields
    return {
      timing: item.timing,
      time,
    };
  });

  return timeSlots ?? [];
};

export const DefaultProductReminderValues: ProductReminderType = {
  name: "",
  image: "",
  productId: "",
  variationId: "",
  productType: "",
  dosageQty: "",
  dosageUnit: "",
  duration: {
    number: "",
    unit: "",
  },
  timeSlotsConsumable: [
    {
      meal: "",
      hours: "",
      minutes: "",
      timeUnit: "AM",
      timing: "beforeMeal",
    },
  ],
  timeSlotsAppBased: [
    {
      hours: "",
      minutes: "",
      timeUnit: "AM",
      timing: "beforeMeal",
    },
  ],
  frequency: [],
};
