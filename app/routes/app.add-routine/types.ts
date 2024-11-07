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
  image: "",
  category: "",
  duration: {
    number: "",
    unit: "",
  },
  channel: [] as string[],
  draft: "draft",
  visibility: "Private" as "Public" | "Private",
};

export type FileGridType = {
  id: string;
  preview: {
    image: {
      url: string;
    };
  };
};

export type FileGridResponseType = {
  success: boolean;
  files: FileGridType[];
};
