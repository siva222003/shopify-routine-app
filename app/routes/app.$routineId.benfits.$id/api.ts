import { apiFetch } from "~/utils/axios";
import { WeeklyBenefitsResponseType } from "./types";
import { json } from "@remix-run/node";

//get benfits
export async function fetchBenfits(id: string) {
  const response = await apiFetch("/admin/benefit/" + id);
  return response as Promise<WeeklyBenefitsResponseType>;
}

//update benfits

export const updateBenefits = async (id: string, data: any) => {
  try {
    await apiFetch(`/admin/benefit/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return json({ success: true, toast: "Benefits updated successfully" });
  } catch (error) {
    return json({ success: false, toast: "Failed to update benefits" });
  }
};

//delete benfits
export const deleteBenefits = async (id: string) => {
  try {
    await apiFetch(`/admin/benefit/${id}`, {
      method: "DELETE",
    });
    return json({ success: true, toast: "Benefits deleted successfully" });
  } catch (error) {
    return json({
      success: false,
      toast:
        error instanceof Error ? error.message : "Failed to delete benefits",
    });
  }
};
