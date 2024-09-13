import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Select,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { PlusIcon } from "@shopify/polaris-icons";
import { addProductValidator } from "~/utils/validators";
import { useForm } from "@rvf/remix";
import { Form } from "@remix-run/react";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function AddMeals({ setCurrentStep }: Props) {
  const [selected, setSelected] = useState("today");

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const options = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" },
    { label: "Night", value: "night" },
  ];

  const form = useForm({
    validator: addProductValidator,
  });

  const [time, setTime] = useState(form.value("time"));

  return (
    <Form method="post" {...form.getFormProps()}>
      <FormLayout>
        <Card>
          <BlockStack gap="300">
            <Select
              label="Date range"
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            <TextField
              name="time"
              type="text"
              label="Time"
              value={time}
              onChange={(value) => setTime(value)}
              autoComplete="off"
              error={form.error("time") || undefined}
            />
            {form.error("time") && (
              <div id="name-error">{form.error("time")}</div>
            )}
          </BlockStack>
        </Card>
        <Button icon={PlusIcon}>Add more slots</Button>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <ButtonGroup>
            <Button onClick={() => setCurrentStep(1)} size="large">
              Back
            </Button>
            <Button
              // onClick={() => setCurrentStep(1)}
              variant="primary"
              size="large"
              submit
            >
              Save & Next
            </Button>
          </ButtonGroup>
        </div>
      </FormLayout>
    </Form>
  );
}
