export type DefaultRoutine = {
  routineName: string;
  description: string;
  category: string;
  duration: string;
  unit: string;
};

export type AddProductType = {
  selectedProduct: null | any;
  productType: string;
  selectedDays: string[];
  intakeFrequency: string;
  dosageQty: string;
  dosageUnit: string;
};

export type AddActivityType = {
  activityName: string;
  activityType: string;
  selectedDays: string[];
  intakeFrequency: string;
  goal: string;
  goalUnit: string;
};
