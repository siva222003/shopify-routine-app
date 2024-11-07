import { DefaultActivityReminderValues } from "../app.$id.add-activity/helper";
import { ActivityReminderType } from "../app.$id.add-activity/validator";
import { EditActivityReminderType } from "./types";

export const EditActivityReminderDefaultValues = (
  data: EditActivityReminderType | null,
) => {
  if (!data) {
    return DefaultActivityReminderValues;
  }

  return {
    name: data.name,
    image: data.image ?? "",
    activityType: data.activityType,
    goal: data.goal,
    unit: data.unit,
    duration: {
      number: data.duration.number.toString(),
      unit: data.duration.unit,
    },
    frequency: data.frequency,

    timeslotActivityBased:
      data.timeslotActivityBased.length > 0
        ? data.timeslotActivityBased.map((slot) => {
            const [timePart, timeUnit] = slot.time.split(" ");
            const [hours, minutes] = timePart.split(":");

            return {
              hours,
              minutes,
              timeUnit,
              timing: slot.timing,
            };
          })
        : DefaultActivityReminderValues.timeslotActivityBased,
  } as ActivityReminderType;
};
