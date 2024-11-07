import { json } from "@remix-run/node";
import { apiFetch } from "~/utils/axios";

export const addProductReminder = async (data: any) => {
  try {
    await apiFetch("/admin/reminder", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return json({
      success: true,
      toast: "Product reminder added successfully",
    });
  } catch (error) {
    return json({
      success: false,
      toast:
        error instanceof Error
          ? error.message
          : "Failed to add product reminder",
    });
  }
};
