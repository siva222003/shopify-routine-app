import { json } from "@remix-run/node";
import { api, apiFetch } from "~/utils/axios";
import { CategorryLoaderData } from "./types";
import { DefaultRoutine } from "./validator";

//Fetch categories
export const fetchCategories = async () => {
  const response = await apiFetch("/admin/category");

  return response as Promise<CategorryLoaderData>;
};

//Upload image
export const uploadImage = async (file: FormData) => {
  const response = await api.post("/admin/upload", file);
  return response.data.data;
};

//Add routine
export const addRoutine = async (values: DefaultRoutine) => {
  try {
    await api.post("/admin/reminderlist", values);

    return json({
      success: true,
      toast: "Routine Added Successfully",
    });
  } catch (error) {
    return json({
      success: false,
      toast: error instanceof Error ? error.message : "Some Error Occured",
    });
  }
};
