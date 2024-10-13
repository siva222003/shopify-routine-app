import { FieldValues, FormApi } from "@rvf/remix";
import { BlockStack, Card, Select, TextField } from "@shopify/polaris";
import { useMemo } from "react";
import { DefaultRoutine } from "~/types";

interface Props {
  form: FormApi<DefaultRoutine>;
  catgories: any[];
}

const CategoryInput = ({ form, catgories }: Props) => {
  const handleCategoryChange = (value: string) => {
    console.log(value);
    form.setValue("category", value); // The value will now be the _id directly
  };

  const categoryOptions = useMemo(() => {
    return catgories.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [catgories]);

  return (
    <Card>
      <BlockStack gap="200">
        <Select
          label="Category"
          placeholder="Select"
          name="category"
          options={categoryOptions} // options now contain both label and value
          value={form.value("category") || ""} // use _id for value
          onChange={handleCategoryChange}
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
