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
