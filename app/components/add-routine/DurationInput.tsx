import { FieldValues, FormApi } from "@rvf/remix";
import {
  BlockStack,
  FormLayout,
  TextField,
  Select,
  Card,
} from "@shopify/polaris";
import { DefaultRoutine } from "~/types";

interface Props {
  form: FormApi<DefaultRoutine>;
}

export default function DurationInput({ form }: Props) {
  const handleDurationChange = (value: string) => {
    form.setValue("duration", value);
  };

  const handleUnitChange = (value: string) => {
    form.setValue("unit", value);
  };

  const formGroupMarkup = (
    <BlockStack gap="100">
      <FormLayout>
        <FormLayout.Group condensed>
          <TextField
            label="Duration"
            name="duration"
            type="number"
            min={1}
            value={form.value("duration") || ""}
            onChange={handleDurationChange}
            autoComplete="off"
            error={form.error("duration") || undefined}
          />
          <Select
            label="Unit"
            placeholder="Select"
            name="unit"
            options={["days", "weeks", "months", "years"]}
            value={form.value("unit") || ""}
            onChange={handleUnitChange}
            error={form.error("unit") || undefined}
          />
        </FormLayout.Group>
      </FormLayout>
    </BlockStack>
  );

  return <Card>{formGroupMarkup}</Card>;
}
