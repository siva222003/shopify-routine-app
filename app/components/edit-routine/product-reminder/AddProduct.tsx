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
} from "@shopify/polaris";
import { useCallback, useEffect } from "react";
import ProductCard from "../ui/ProductCard";
import { getError } from "~/utils/validated-from";
import { AddProductType } from "~/types";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  product: AddProductType;
  setProduct: React.Dispatch<React.SetStateAction<AddProductType>>;
}

const AddProduct = ({ setCurrentStep, product, setProduct }: Props) => {
  const handleChange = useCallback(
    (_: boolean, newValue: string) =>
      setProduct({ ...product, intakeFrequency: newValue }),
    [],
  );

  const fetchProducts = async () => {
    const selected = await shopify.resourcePicker({ type: "product" });
    setProduct({ ...product, selectedProduct: selected && selected[0] });
  };

  console.log({ product });

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <FormLayout>
        {product.selectedProduct ? (
          <ProductCard setProduct={setProduct} product={product} />
        ) : (
          <Button size="large" onClick={fetchProducts}>
            Select Product
          </Button>
        )}

        <Select
          label="Product Type"
          placeholder="Select"
          name="productType"
          options={["consumable", "applicationBased"]}
          value={product.productType}
          onChange={(value) => setProduct({ ...product, productType: value })}
        />

        <FormLayout.Group condensed>
          <TextField
            label="Dosage Quantity"
            name="dosageQty"
            type="number"
            min={1}
            value={product.dosageQty}
            onChange={(value) => setProduct({ ...product, dosageQty: value })}
            autoComplete="off"
          />
          <Select
            label="Dosage Unit"
            placeholder="Select"
            name="dosageUnit"
            options={["puff", "inhale"]}
            value={product.dosageUnit}
            onChange={(value) => setProduct({ ...product, dosageUnit: value })}
          />
        </FormLayout.Group>

        <BlockStack>
          <RadioButton
            label="Daily"
            helpText="Users have to take this routine every day."
            checked={product.intakeFrequency === "daily"}
            id="daily"
            name="daily"
            onChange={handleChange}
          />
          <RadioButton
            label="Custom days"
            helpText="Users can select the days they want to take this routine."
            id="custom"
            name="daily"
            checked={product.intakeFrequency === "custom"}
            onChange={handleChange}
          />
        </BlockStack>

        {product.intakeFrequency === "custom" && (
          <Card>
            <OptionList
              title="Select days"
              onChange={(selected) =>
                setProduct({ ...product, selectedDays: selected })
              }
              allowMultiple
              options={[
                { value: "Monday", label: "Monday" },
                { value: "Tuesday", label: "Tuesday" },
                { value: "Wednesday", label: "Wednesday" },
                { value: "Thursday", label: "Thursday" },
                { value: "Friday", label: "Friday" },
                { value: "Saturday", label: "Saturday" },
                { value: "Sunday", label: "Sunday" },
              ]}
              selected={product.selectedDays}
            />
          </Card>
        )}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <ButtonGroup>
            <Button
              onClick={() => navigate(`/app/${id}/reminder`)}
              size="large"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              variant="primary"
              size="large"
              submit={true}
            >
              Save & Next
            </Button>
          </ButtonGroup>
        </div>
      </FormLayout>
    </>
  );
};

export default AddProduct;
