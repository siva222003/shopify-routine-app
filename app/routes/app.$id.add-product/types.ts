type TimeSlotConsumable = {
  meal: "" | "Breakfast" | "Brunch" | "Lunch" | "Dinner";
  hours: string;
  minutes: string;
  timeUnit: "AM" | "PM";
  timing: "beforeMeal" | "afterMeal";
};

type TimeSlotAppBased = {
  hours: string;
  minutes: string;
  timeUnit: "AM" | "PM";
  timing: "beforeMeal" | "afterMeal";
};

export type TimeSlot = TimeSlotConsumable | TimeSlotAppBased;
