import { number } from "zod";
import { apiFetch } from "~/utils/axios";
import { RoutineListResponse } from "./types";
import { json } from "@remix-run/node";

export const fetchRoutineList = async (page: number) => {
  const response = await apiFetch(`/admin/reminderlist?page=${page}`);

  return response as RoutineListResponse;
};

export const deleteRoutine = async (id: string) => {
  try {
    await apiFetch(`/admin/reminderlist/${id}`, {
      method: "DELETE",
    });

    return json({ success: true, toast: "Routine Deleted Successfully" });
  } catch (error) {
    return json({
      success: false,
      toast: error instanceof Error ? error.message : "Delete Failed",
    });
  }
};

export const cloneRoutine = async (id: string) => {
  try {
    await apiFetch(`/admin/reminderlist/template/clone/${id}`, {
      method: "POST",
    });

    return json({ success: true, toast: "Routine Cloned Successfully" });
  } catch (error) {
    return json({
      success: false,
      toast: error instanceof Error ? error.message : "Clone Failed",
    });
  }
};
