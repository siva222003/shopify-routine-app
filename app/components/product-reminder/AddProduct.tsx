import { Form, useNavigate, useParams } from "@remix-run/react";
import {
  Card,
  FormLayout,
  RadioButton,
  TextField,
  BlockStack,
  OptionList,
  ButtonGroup,
  Button,
  Select,
  Text,
  InlineGrid,
  InlineError,
  Box,
} from "@shopify/polaris";
import { ExportIcon } from "@shopify/polaris-icons";
import ProductCard from "./ui/ProductCard";
import { FormApi } from "@rvf/remix";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface Props {
  form: FormApi<ProductReminderType>;
}

const AddProduct = ({ form }: Props) => {
  const fetchProducts = async () => {
    const selected = await shopify.resourcePicker({ type: "product" });
    console.log(selected && selected[0]);

    if (selected && selected[0]) {
      const selectedProduct = selected[0] as any;

      const name = selectedProduct.title;
      const image = selectedProduct.images[0].originalSrc;
      const productId = selectedProduct.id;

      const variantId = selectedProduct.variants[0].id;

      const variationId = variantId.split("/").pop();

      form.setValue("name", name);
      form.setValue("image", image);
      form.setValue("productId", productId);
      form.setValue("variationId", variationId);
    }
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const isValidProduct =
    form.value("name") !== "" &&
    form.value("image") !== "" &&
    form.value("productId") !== "" &&
    form.value("variationId") !== "";

  const productError =
    form.error("name") &&
    form.error("image") &&
    form.error("productId") &&
    form.error("variationId")
      ? "Add atleast one product"
      : form.error("name") ||
        form.error("image") ||
        form.error("productId") ||
        form.error("variationId");

  return (
    <>
      {isValidProduct ? (
        <ProductCard form={form} fetchProducts={fetchProducts} />
      ) : (
        <Card roundedAbove="sm">
          <BlockStack gap="200">
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">
                Product
              </Text>
              <Button
                onClick={fetchProducts}
                accessibilityLabel="Export variants"
                icon={ExportIcon}
              />
            </InlineGrid>
            <Text as="p" variant="bodyMd">
              Add a product vaiant to create a reminder
            </Text>
          </BlockStack>

          <Box paddingBlockStart={"200"} paddingBlockEnd={"100"}>
            <InlineError message={productError || ""} fieldID="product-error" />
          </Box>
        </Card>
      )}

      <input
        type="text"
        hidden
        name="name"
        value={form.value("name")}
        onChange={() => {}}
      />
      <input
        type="text"
        hidden
        name="image"
        value={form.value("image")}
        onChange={() => {}}
      />
      <input
        type="text"
        hidden
        name="productId"
        value={form.value("productId")}
        onChange={() => {}}
      />
      <input
        type="text"
        hidden
        name="variationId"
        value={form.value("variationId")}
        onChange={() => {}}
      />
    </>
  );
};

export default AddProduct;
