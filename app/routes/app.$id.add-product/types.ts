type TimeSlotConsumable = {
  mealType: "" | "Breakfast" | "Brunch" | "Lunch" | "Dinner";
  hours: string;
  minutes: string;
  timeUnit: "AM" | "PM";
  mealTime: "beforeMeal" | "afterMeal";
};

type TimeSlotAppBased = {
  hours: string;
  minutes: string;
  timeUnit: "AM" | "PM";
  mealTime: "beforeMeal" | "afterMeal";
};

export type TimeSlot = TimeSlotConsumable | TimeSlotAppBased;
