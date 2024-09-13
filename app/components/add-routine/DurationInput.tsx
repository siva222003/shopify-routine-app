import { FieldValues, FormApi } from "@rvf/remix";
import {
  BlockStack,
  FormLayout,
  TextField,
  Select,
  Card,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

interface Props {
  form: FormApi<FieldValues>;
}

export default function DurationInput({ form }: Props) {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");

  const handleWeightChange = useCallback(
    (value: string) => setWeight(value),
    [],
  );
  const handleUnitChange = useCallback((value: string) => setUnit(value), []);

  const formGroupMarkup = (
    <BlockStack gap="100">
      <FormLayout>
        <FormLayout.Group condensed>
          <TextField
            label="Duration"
            name="duration"
            type="number"
            min={1}
            value={weight}
            onChange={handleWeightChange}
            autoComplete="off"
            error={form.error("duration") || undefined}
          />
          <Select
            label="Unit"
            placeholder="Select"
            name="unit"
            options={["days", "months", "years"]}
            value={unit}
            onChange={handleUnitChange}
            error={form.error("unit") || undefined}
          />
        </FormLayout.Group>
      </FormLayout>
    </BlockStack>
  );

  return <Card>{formGroupMarkup}</Card>;
}
