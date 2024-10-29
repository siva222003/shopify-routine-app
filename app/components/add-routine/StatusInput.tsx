import { FormApi } from "@rvf/remix";
import { BlockStack, Card, Select } from "@shopify/polaris";
import { useCallback } from "react";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
}

export default function StatusInput({ form }: Props) {
  const handleStatusChange = useCallback(
    (value: string) => {
      // Convert select value to boolean for form
      // const draft = value === "draft";
      form.setValue("draft", value);
    },
    [form],
  );

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Active", value: "active" },
  ];

  const visibilityOptions = [
    { label: "Public", value: "Public" },
    { label: "Private", value: "Private" },
  ];

  return (
    <BlockStack gap="500">
      <Card>
        <Select
          name="draft"
          label="Status"
          options={statusOptions}
          onChange={handleStatusChange}
          value={form.value("draft")}
        />
      </Card>
      <Card>
        <Select
          name="visibility"
          label="Visibility"
          options={visibilityOptions}
          onChange={(val) =>
            form.setValue("visibility", val as "Public" | "Private")
          }
          value={form.value("visibility")}
        />
      </Card>
    </BlockStack>
  );
}
