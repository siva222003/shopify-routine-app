import { ActivityReminderType } from "../app.$id.add-activity/validator";

export type EditActivityReminderType = Omit<
  ActivityReminderType,
  "timeslotActivityBased"
> & {
  timeslotActivityBased: {
    time: string;
    timing: "beforeMeal" | "afterMeal";
  }[];
};

export type EditActivityReminderResponseType = {
  success: boolean;
  data: EditActivityReminderType;
};
