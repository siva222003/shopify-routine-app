import { apiFetch } from "~/utils/axios";
import { EditRoutineResponseType } from "../app.routine.$id/types";
import { json } from "@remix-run/node";

export const fetchRoutineForDuration = async (id: string) => {
  const response = await apiFetch(`/admin/reminderlist/${id}`);
  return response as EditRoutineResponseType;
};

export const addWeeklyBenefits = async (values: any) => {
  try {
    await apiFetch(`/admin/benefit`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    return json({ success: true, toast: "Weekly benefits added successfully" });
  } catch (error) {
    return json({
      success: false,
      toast:
        error instanceof Error
          ? error.message
          : "Failed to add weekly benefits",
    });
  }
};
