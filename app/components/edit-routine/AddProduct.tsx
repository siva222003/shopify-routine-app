import { Form } from "@remix-run/react";
import {
  Card,
  FormLayout,
  RadioButton,
  TextField,
  BlockStack,
  OptionList,
  ButtonGroup,
  Button,
} from "@shopify/polaris";
import DatePickerExample from "./DatePicker";
import { useCallback, useState } from "react";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const AddProduct = ({ setCurrentStep }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const [value, setValue] = useState("disabled");

  const handleChange = useCallback(
    (_: boolean, newValue: string) => setValue(newValue),
    [],
  );

  return (
    <>
      <Form style={{ paddingBottom: "20px" }} method="post">
        <FormLayout>
          <FormLayout.Group>
            <TextField
              type="number"
              label="Product Name"
              onChange={() => {}}
              autoComplete="off"
            />
            <TextField
              type="number"
              label="Product Type"
              onChange={() => {}}
              autoComplete="off"
            />
          </FormLayout.Group>

          <Card>
            <DatePickerExample />
          </Card>

          <FormLayout.Group>
            <TextField
              type="number"
              label="DosageQty"
              onChange={() => {}}
              autoComplete="off"
            />
            <TextField
              type="number"
              label="DosageUnit"
              onChange={() => {}}
              autoComplete="off"
            />
          </FormLayout.Group>

          <BlockStack>
            <RadioButton
              label="Daily"
              helpText="Users have to take this routine every day."
              checked={value === "disabled"}
              id="disabled"
              name="accounts"
              onChange={handleChange}
            />
            <RadioButton
              label="Custom days"
              helpText="Users can select the days they want to take this routine."
              id="optional"
              name="accounts"
              checked={value === "optional"}
              onChange={handleChange}
            />
          </BlockStack>

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
        </FormLayout>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <ButtonGroup>
            <Button size="large">Back</Button>
            <Button
              onClick={() => setCurrentStep(2)}
              variant="primary"
              size="large"
              submit
            >
              Save & Next
            </Button>
          </ButtonGroup>
        </div>
      </Form>
    </>
  );
};

export default AddProduct;
