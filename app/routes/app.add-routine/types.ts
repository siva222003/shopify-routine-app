export type LoaderData = {
  success: boolean;
  categories: {
    name: string;
    status: boolean;
    aiImages: string[];
    createdAt: string;
    updatedAt: string;
  }[];
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
