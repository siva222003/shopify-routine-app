import { RoutineDefaultValues } from "../app.add-routine/types";
import { DefaultRoutine } from "../app.add-routine/validator";
import { EditRoutineType } from "./types";

export const EditRoutineDefaultValues = (data: EditRoutineType | null) => {
  if (!data) return RoutineDefaultValues;

  return {
    name: data.name ?? "",
    image: data.image ?? "",
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
