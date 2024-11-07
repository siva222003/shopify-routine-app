import { json } from "@remix-run/node";
import { apiFetch } from "~/utils/axios";

export const addActivityReminder = async (data: any) => {
  try {
    await apiFetch("/admin/reminder-activity", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return json({
      success: true,
      toast: "Activity reminder added successfully",
    });
  } catch (error) {
    return json({
      success: false,
      toast:
        error instanceof Error
          ? error.message
          : "Failed to add activity reminder",
    });
  }
};
