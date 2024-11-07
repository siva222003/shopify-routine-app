import { json } from "@remix-run/node";
import { apiFetch } from "~/utils/axios";
import { EditActivityReminderResponseType } from "./types";

export const fetchActivityReminder = async (id: string) => {
  const response = await apiFetch(`/admin/reminder-activity/${id}`);
  return response as EditActivityReminderResponseType;
};

export const updateActivityReminder = async (id: string, data: any) => {
  try {
    await apiFetch(`/admin/reminder-activity/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return json({
      success: true,
      toast: "Activity Reminder updated successfully",
    });
  } catch (error) {
    return json({
      success: false,
      toast: "Failed to update activity reminder",
    });
  }
};
