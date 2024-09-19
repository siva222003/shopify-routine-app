import { FieldValues, FormApi } from "@rvf/remix";
import { BlockStack, Card, TextField } from "@shopify/polaris";
import { DefaultRoutine } from "~/types";

interface Props {
  form: FormApi<DefaultRoutine>;
}

const CategoryInput = ({ form }: Props) => {
  return (
    <Card>
      <BlockStack gap="200">
        <TextField
          name="category"
          label="Category"
          type="text"
          autoComplete="off"
          value={form.value("category") || ""}
          onChange={(e) => form.setValue("category", e)}
          helpText={
            <span>
              We'll use this email address to inform you on future changes to
              Polaris.
            </span>
          }
          error={form.error("category") || undefined}
        />

        <TextField
          name="description"
          label="Description"
          type="text"
          autoComplete="off"
          value={form.value("description") || ""}
          onChange={(e) => form.setValue("description", e)}
          multiline={6}
          helpText={
            <span>
              We'll use this email address to inform you on future changes to
              Polaris.
            </span>
          }
          error={form.error("description") || undefined}
        />
      </BlockStack>
    </Card>
  );
};

export default CategoryInput;
