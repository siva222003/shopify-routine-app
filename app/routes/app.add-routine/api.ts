import { json } from "@remix-run/node";
import { api } from "~/utils/axios";
import { LoaderData } from "./types";

export const fetchCategories = async () => {
  const response = await api.get("/admin/category");

  return json<LoaderData>({
    success: true,
    categories: response.data.data.docs,
  });
};

export const uploadImage = async (file: FormData) => {
  const response = await api.post("/admin/upload", file);
  return response.data.data;
};
