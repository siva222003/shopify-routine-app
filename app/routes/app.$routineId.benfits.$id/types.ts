import { WeeklyBenefitsType } from "../app.$id.weekly-benfits/validator";

export type WeeklyBenefitsResponseType = {
  success: boolean;
  data: WeeklyBenefitsType & { _id: string };
};
