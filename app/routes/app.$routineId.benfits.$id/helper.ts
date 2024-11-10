import { WeeklyBenfitsDefaultValues } from "../app.$id.weekly-benfits/helper";
import { WeeklyBenefitsType } from "../app.$id.weekly-benfits/validator";

export const EditWeeklyBenefitsDefaultValues = (
  data: (WeeklyBenefitsType & { _id: string }) | null,
) => {
  if (!data) return WeeklyBenfitsDefaultValues;

  return {
    totalWeeks: data.totalWeeks.toString() ?? "",
    weeklyBenefits: data.weeklyBenefits ?? [
      {
        weekRange: "0-1",
        benefits: [""],
      },
    ],
  } as WeeklyBenefitsType;
};
