import { FormApi } from "@rvf/remix";
import { BlockStack, Card, Select } from "@shopify/polaris";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface ProductTypeInputProps {
  form: FormApi<ProductReminderType>;
}

const ProductTypeInput = ({ form }: ProductTypeInputProps) => {
  return (
    <Card>
      <BlockStack gap="600">
        <Select
          label="Product Type"
          placeholder="Select"
          name="productType"
          options={["consumable", "applicationBased"]}
          value={form.value("productType")}
          onChange={(e) => form.setValue("productType", e)}
          error={form.error("productType") || undefined}
        />
      </BlockStack>
    </Card>
  );
};

export default ProductTypeInput;
