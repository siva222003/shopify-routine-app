import { WeeklyBenefitsType } from "./validator";

type Duration = {
  number: number;
  unit: string;
};

export function generateWeeksArray(duration: Duration): string[] {
  const { number, unit } = duration;
  let totalWeeks = 0;

  switch (unit) {
    case "Day(s)":
      // Assuming 7 days per week
      totalWeeks = Math.ceil(number / 7);
      break;
    case "Week(s)":
      totalWeeks = number;
      break;
    case "Month(s)":
      // Assuming 4 weeks per month
      totalWeeks = number * 4;
      break;
    default:
      throw new Error("Invalid duration unit");
  }
  return Array.from({ length: totalWeeks }, (_, i) => `${i + 1}`);
}

export function generateIntervals(
  selectedWeek: number,
  totalDuration: number,
): string[] {
  const intervalCount = totalDuration / selectedWeek;
  const intervals: string[] = [];

  for (let i = 0; i < intervalCount; i++) {
    const start = i * selectedWeek;
    const end = start + selectedWeek;
    intervals.push(`${start}-${end}`);
  }

  return intervals;
}

export const WeeklyBenfitsDefaultValues: WeeklyBenefitsType = {
  totalWeeks: "",
  weeklyBenefits: [
    {
      weekRange: "0-1",
      benefits: [""],
    },
  ],
};
