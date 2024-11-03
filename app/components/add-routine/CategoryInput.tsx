import { FieldValues, FormApi } from "@rvf/remix";
import { BlockStack, Card, Select, TextField } from "@shopify/polaris";
import { useMemo } from "react";
import { CategoryType } from "~/routes/app.add-routine/types";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
  categories: CategoryType[];
}

const CategoryInput = ({ form, categories }: Props) => {
  const handleCategoryChange = (value: string) => {
    console.log(value);
    form.setValue("category", value);
  };

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [categories]);

  return (
    <Select
      label="Category"
      placeholder="Select"
      name="category"
      options={categoryOptions}
      value={form.value("category") || ""}
      onChange={handleCategoryChange}
      error={form.error("category") || undefined}
    />
  );
};

export default CategoryInput;
