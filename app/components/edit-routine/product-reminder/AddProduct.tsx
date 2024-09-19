import { Form, useNavigate, useParams, useSubmit } from "@remix-run/react";
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
import { FormEvent, useCallback, useEffect, useState } from "react";
import ProductCard from "../ui/ProductCard";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  selectedProduct: any;
  setSelectedProduct: React.Dispatch<any>;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  dosageQty: string;
  setDosageQty: React.Dispatch<React.SetStateAction<string>>;
  dosageUnit: string;
  setDosageUnit: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const AddProduct = ({
  setCurrentStep,
  selectedProduct,
  setSelectedProduct,
  selected,
  setSelected,
  value,
  setValue,
  dosageQty,
  setDosageQty,
  dosageUnit,
  setDosageUnit,
  description,

  setDescription,
}: Props) => {
  const handleChange = useCallback(
    (_: boolean, newValue: string) => setValue(newValue),
    [],
  );

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    const selected = await shopify.resourcePicker({ type: "product" });
    setSelectedProduct(selected);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      {/* <Form style={{ paddingBottom: "20px" }} onSubmit={handleSubmit}> */}
      <FormLayout>
        {selectedProduct ? (
          <ProductCard
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct[0]}
          />
        ) : (
          <Button size="large" onClick={fetchProducts}>
            Select Product
          </Button>
        )}

        <TextField
          type="text"
          name="description"
          label="Product Description"
          value={description}
          multiline={5}
          onChange={setDescription}
          autoComplete="off"
        />

        <FormLayout.Group condensed>
          <TextField
            label="Dosage Quantity"
            name="dosageQty"
            type="number"
            min={1}
            value={dosageQty}
            onChange={setDosageQty}
            autoComplete="off"
          />
          <Select
            label="Dosage Unit"
            placeholder="Select"
            name="dosageUnit"
            options={["puff", "inhale"]}
            value={dosageUnit}
            onChange={setDosageUnit}
          />
        </FormLayout.Group>

        <BlockStack>
          <RadioButton
            label="Daily"
            helpText="Users have to take this routine every day."
            checked={value === "daily"}
            id="daily"
            name="daily"
            onChange={handleChange}
          />
          <RadioButton
            label="Custom days"
            helpText="Users can select the days they want to take this routine."
            id="custom"
            name="daily"
            checked={value === "custom"}
            onChange={handleChange}
          />
        </BlockStack>

        {value === "custom" && (
          <Card>
            <OptionList
              title="Select days"
              onChange={setSelected}
              allowMultiple
              options={[
                { value: "monday", label: "Monday" },
                { value: "tuesday", label: "Tuesday" },
                { value: "wednesday", label: "Wednesday" },
                { value: "thursday", label: "Thursday" },
                { value: "friday", label: "Friday" },
                { value: "saturday", label: "Saturday" },
                { value: "sunday", label: "Sunday" },
              ]}
              selected={selected}
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
              submit={false}
            >
              Save & Next
            </Button>
          </ButtonGroup>
        </div>
      </FormLayout>
      {/* </Form> */}
    </>
  );
};

export default AddProduct;
function SelectPayload<T>(undefined: undefined) {
  throw new Error("Function not implemented.");
}
