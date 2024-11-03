import { FormApi } from "@rvf/remix";
import { Card, FormLayout, Select, TextField } from "@shopify/polaris";
import React from "react";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface DosageInputProps {
  form: FormApi<ProductReminderType>;
}

const DosageInput = ({ form }: DosageInputProps) => {
  return (
    <Card>
      <FormLayout.Group condensed>
        <TextField
          label="Dosage Quantity"
          name="dosageQty"
          type="text"
          value={form.value("dosageQty")}
          onChange={(e) => form.setValue("dosageQty", e)}
          autoComplete="off"
          error={form.error("dosageQty") || undefined}
        />

        <TextField
          label="Dosage Unit"
          name="dosageUnit"
          type="text"
          autoComplete="off"
          value={form.value("dosageUnit")}
          onChange={(e) => form.setValue("dosageUnit", e)}
          error={form.error("dosageUnit") || undefined}
        />
      </FormLayout.Group>
    </Card>
  );
};

export default DosageInput;
