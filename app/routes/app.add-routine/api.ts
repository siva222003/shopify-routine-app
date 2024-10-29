import { json } from "@remix-run/node";
import { api } from "~/utils/axios";
import { LoaderData } from "./types";
import { DefaultRoutine } from "./validator";

//Fetch categories
export const fetchCategories = async () => {
  const response = await api.get("/admin/category");

  return json<LoaderData>({
    success: true,
    categories: response.data.data.docs,
  });
};

//Upload image
export const uploadImage = async (file: FormData) => {
  const response = await api.post("/admin/upload", file);
  return response.data.data;
};

//Add routine
export const addRoutine = async (values: DefaultRoutine) => {
  const response = await api.post("/admin/reminderlist", values);
  return response.data.data;
};
