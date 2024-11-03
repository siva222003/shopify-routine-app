export type CategoryType = {
  _id: string;
  name: string;
  status: boolean;
  aiImages: string[];
  createdAt: string;
  updatedAt: string;
};

export type CategorryLoaderData = {
  success: boolean;
  data: {
    docs: CategoryType[];
  };
};

export const RoutineDefaultValues = {
  name: "",
  description: "",
  category: "",
  duration: {
    number: "",
    unit: "",
  },
  channel: [] as string[],
  draft: "draft",
  visibility: "Private" as "Public" | "Private",
};
