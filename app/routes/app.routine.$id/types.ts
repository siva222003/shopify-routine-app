import { WeeklyBenefitsType } from "../app.$id.weekly-benfits/validator";
import { RoutineListType } from "../app.routine-list.$page/types";

export type EditRoutineType = RoutineListType & {
  channels: string[];
  productReminders: ProductReminderType[];
  activityReminders: ActivityReminderType[];
  benefits: WeeklyBenefitsType & { _id: string };
};

export type ActivityReminderType = {
  _id: string;
  name: string;
  image: string;
  reminderListId: string;
  activityType: string;
};

export type ProductReminderType = {
  _id: string;
  name: string;
  image: string;
  reminderListId: string;
  productType: string;
};

export type EditRoutineResponseType = {
  success: boolean;
  data: EditRoutineType;
};
