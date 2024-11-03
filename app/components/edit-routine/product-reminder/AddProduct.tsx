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
} from "@shopify/polaris";
import { ExportIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect } from "react";
import ProductCard from "../ui/ProductCard";
import { AddProductType } from "~/types";

interface Props {}

const AddProduct = ({}: Props) => {
  const fetchProducts = async () => {
    const selected = await shopify.resourcePicker({ type: "product" });
    console.log(selected);
    // setProduct({ ...product, selectedProduct: selected && selected[0] });
  };

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      {/* {product.selectedProduct ? (
        <ProductCard setProduct={setProduct} product={product} />
      ) : (
        <Button size="large" onClick={fetchProducts}>
          Select Product
        </Button>
      )} */}

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
      </Card>
    </>
  );
};

export default AddProduct;
