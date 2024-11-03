import { apiFetch } from "~/utils/axios";
import { EditRoutineResponseType, EditRoutineType } from "./types";
import { json, redirect } from "@remix-run/node";
import { DefaultRoutine } from "../app.add-routine/validator";

export const fetchRoutine = async (id: string) => {
  const response = await apiFetch(`/admin/reminderlist/${id}`);
  return response as EditRoutineResponseType;
};

export const updateRoutine = async (id: string, data: DefaultRoutine) => {
  try {
    console.log({ id, data });

    await apiFetch(`/admin/reminderlist/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return json({ success: true, toast: "Routine updated successfully" });
  } catch (error) {
    return json({ success: false, toast: "Failed to update routine" });
  }
};

export const deleteRoutine = async (id: string) => {
  try {
    await apiFetch(`/admin/reminderlist/${id}`, {
      method: "DELETE",
    });
    return json({ success: true, toast: "Routine deleted successfully" });
  } catch (error) {
    return json({
      success: false,
      toast:
        error instanceof Error ? error.message : "Failed to delete routine",
    });
  }
};
