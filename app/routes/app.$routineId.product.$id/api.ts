import { json } from "@remix-run/node";
import { apiFetch } from "~/utils/axios";
import { EditProductReminderResponseType } from "./types";

export const fetchProductReminder = async (id: string) => {
  const response = await apiFetch(`/admin/reminder/${id}`);
  return response as EditProductReminderResponseType;
};

export const updateProductReminder = async (id: string, data: any) => {
  try {
    await apiFetch(`/admin/reminder/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return json({
      success: true,
      toast: "Product Reminder updated successfully",
    });
  } catch (error) {
    return json({ success: false, toast: "Failed to update prouct reminder" });
  }
};
