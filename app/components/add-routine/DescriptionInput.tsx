import { FormApi } from "@rvf/remix";
import { TextField } from "@shopify/polaris";
import React from "react";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
}

const DescriptionInput = ({ form }: Props) => {
  return (
    <TextField
      name="description"
      label="Description"
      type="text"
      autoComplete="off"
      value={form.value("description") || ""}
      onChange={(e) => form.setValue("description", e)}
      multiline={6}
      error={form.error("description") || undefined}
    />
  );
};

export default DescriptionInput;
