import { ActivityReminderType } from "./validator";

export const formattedActivityBasedTimeslots = (
  data: ActivityReminderType["timeslotActivityBased"] = [],
) => {
  const timeSlots = data.map((item) => {
    // Format hours and minutes to two-digit format
    const hours = item.hours.padStart(2, "0");
    const minutes = item.minutes.padStart(2, "0");

    // Create the "time" key
    const time = `${hours}:${minutes} ${item.timeUnit}`;

    // Return a new object with only the necessary fields
    return {
      time,
    };
  });

  return timeSlots ?? [];
};

export const DefaultActivityReminderValues: ActivityReminderType = {
  name: "",
  image: "",
  activityType: "",
  goal: "",
  unit: "",
  duration: {
    number: "",
    unit: "",
  },
  timeslotActivityBased: [
    {
      hours: "",
      minutes: "",
      timeUnit: "AM",
    },
  ],

  frequency: [],
};
