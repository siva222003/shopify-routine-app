import { useAsyncValue } from "@remix-run/react";
import { FormApi } from "@rvf/remix";
import { Card, Select } from "@shopify/polaris";
import { useEffect, useMemo } from "react";
import {
  generateIntervals,
  generateWeeksArray,
} from "~/routes/app.$id.weekly-benfits/helper";
import { WeeklyBenefitsType } from "~/routes/app.$id.weekly-benfits/validator";
import { EditRoutineResponseType } from "~/routes/app.routine.$id/types";

interface WeekIntervalsInputProps {
  form: FormApi<WeeklyBenefitsType>;
}

const WeekIntervalsInput = ({ form }: WeekIntervalsInputProps) => {
  const { data } = useAsyncValue() as EditRoutineResponseType;
  const { name, duration } = data;

  const selectOptions = useMemo(() => generateWeeksArray(duration), [duration]);

  const weekIntervalsArray = useMemo(() => {
    const totalWeeks = parseInt(form.value("totalWeeks") || "1");
    return generateIntervals(
      totalWeeks,
      parseInt(
        form.value("totalWeeks") === "" ? "1" : selectOptions.length.toString(),
      ),
    );
  }, [form.value("totalWeeks"), duration.number]);

  useEffect(() => {
    const newWeeklyBenefits = weekIntervalsArray.map((weekRange, index) => ({
      weekRange,
      benefits: form.value("weeklyBenefits")[index]?.benefits || [""],
    }));

    form.setValue("weeklyBenefits", newWeeklyBenefits);
  }, [weekIntervalsArray]);

  return (
    <Card>
      <Select
        label="Select Week Intervals"
        placeholder="Select"
        name="totalWeeks"
        options={selectOptions}
        helpText={`Total Weeks for your “${name}” is ${duration.number} ${duration.unit}`}
        value={form.value("totalWeeks") || ""}
        onChange={(e) => form.setValue("totalWeeks", e)}
        error={form.error("totalWeeks") || undefined}
      />
    </Card>
  );
};

export default WeekIntervalsInput;
