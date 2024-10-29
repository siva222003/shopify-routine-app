import { FormApi } from "@rvf/remix";
import {
  BlockStack,
  FormLayout,
  TextField,
  Select,
  Card,
} from "@shopify/polaris";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
}
export default function DurationInput({ form }: Props) {
  const handleDurationChange = (value: string) => {
    const currentUnit = form.value("duration.unit") || "";
    form.setValue("duration", { number: value, unit: currentUnit });
  };

  const handleUnitChange = (value: string) => {
    const currentDuration = form.value("duration.number") || "";
    form.setValue("duration", { number: currentDuration, unit: value });
  };

  const formGroupMarkup = (
    <BlockStack gap="100">
      <FormLayout>
        <FormLayout.Group condensed>
          <TextField
            label="Duration"
            name="duration.number"
            type="number"
            value={form.value("duration.number") || ""}
            onChange={handleDurationChange}
            autoComplete="off"
            error={form.error("duration.number") || undefined}
          />
          <Select
            label="Unit"
            placeholder="Select"
            name="duration.unit"
            options={["Day(s)", "Week(s)", "Month(s)"]}
            value={form.value("duration.unit") || ""}
            onChange={handleUnitChange}
            error={form.error("duration.unit") || undefined}
          />
        </FormLayout.Group>
      </FormLayout>
    </BlockStack>
  );

  return <Card>{formGroupMarkup}</Card>;
}
