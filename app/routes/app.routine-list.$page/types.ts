type Category = {
  _id: string;
  name: string;
};

type Visibility = "Public" | "Private";

export type RoutineListResponse = {
  success: boolean;
  data: {
    docs: RoutineListType[];
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
};

export type RoutineListType = {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  duration: {
    number: number;
    unit: string;
  };
  channel: string[];
  draft: string;
  visibility: Visibility;
};
