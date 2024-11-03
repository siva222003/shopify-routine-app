import { RoutineDefaultValues } from "../app.add-routine/types";
import { DefaultRoutine } from "../app.add-routine/validator";
import { RoutineListType } from "../app.routine-list.$page/types";

export type EditRoutineType = RoutineListType & {
  channels: string[];
  productReminders: ProductReminderType[];
  activityReminders: ActivityReminderType[];
};

export const EditRoutineDefaultValues = (data: EditRoutineType | null) => {
  if (!data) return RoutineDefaultValues;

  return {
    name: data.name ?? "",
    category: data.category._id ?? "",
    description: data.description ?? "",
    duration: {
      number: data.duration.number.toString() ?? "",
      unit: data.duration.unit ?? "",
    },
    draft: data.draft ? "draft" : "active",
    channel: data.channel ?? ([] as string[]),
    visibility: data.visibility ?? ("Private" as "Public" | "Private"),
  } as DefaultRoutine;
};

export type ActivityReminderType = {
  _id: string;
  name: string;
  image: string;
  activityType: string;
};

export type ProductReminderType = {
  _id: string;
  name: string;
  image: string;
  productType: string;
};

export type EditRoutineResponseType = {
  success: boolean;
  data: EditRoutineType;
};
