import { FormApi } from "@rvf/remix";
import { Card, FormLayout, Select, TextField } from "@shopify/polaris";
import React from "react";
import { ActivityReminderType } from "~/routes/app.$id.add-activity/validator";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface GoalInputProps {
  form: FormApi<ActivityReminderType>;
}

const GoalInput = ({ form }: GoalInputProps) => {
  return (
    <Card>
      <FormLayout.Group condensed>
        <TextField
          label="Goal"
          name="goal"
          type="number"
          value={form.value("goal")}
          onChange={(e) => form.setValue("goal", e)}
          autoComplete="off"
          error={form.error("goal") || undefined}
        />

        <TextField
          label="Unit"
          name="unit"
          type="text"
          autoComplete="off"
          value={form.value("unit")}
          onChange={(e) => form.setValue("unit", e)}
          error={form.error("unit") || undefined}
        />
      </FormLayout.Group>
    </Card>
  );
};

export default GoalInput;
