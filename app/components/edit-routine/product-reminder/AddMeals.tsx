import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  Select,
  TextField,
} from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { PlusIcon } from "@shopify/polaris-icons";
import { addProductValidator } from "~/utils/validators";
import { useForm } from "@rvf/remix";
import { Form } from "@remix-run/react";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function AddMeals({ setCurrentStep }: Props) {
  const options = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" },
    { label: "Night", value: "night" },
  ];

  const form = useForm({
    validator: addProductValidator,
  });

  const initialState = useMemo(() => {
    return {
      dateRange: "morning",
      hours: "",
      minutes: "",
      unit: "AM",
    };
  }, []);

  const [slots, setSlots] = useState([initialState]);

  return (
    // <Form method="post" {...form.getFormProps()}>
    <FormLayout>
      {slots.map((slot, index) => (
        <Card key={index}>
          <BlockStack gap="300">
            <Select
              label="Date range"
              options={options}
              name="timeRange"
              onChange={(e) => {
                setSlots((prev) => {
                  const newSlots = [...prev];
                  newSlots[index].dateRange = e;
                  return newSlots;
                });
              }}
              value={slot.dateRange}
            />

            <FormLayout.Group condensed>
              <TextField
                label="Hours"
                name="hours"
                type="number"
                min={1}
                value={slot.hours}
                onChange={(e) => {
                  setSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[index].hours = e;
                    return newSlots;
                  });
                }}
                autoComplete="off"
              />
              <TextField
                label="Minutes"
                name="minutes"
                type="number"
                min={1}
                value={slot.minutes}
                onChange={(e) => {
                  setSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[index].minutes = e;
                    return newSlots;
                  });
                }}
                autoComplete="off"
              />
              <Select
                label="AM/PM"
                placeholder="Select"
                name="unit"
                value={slot.unit}
                onChange={(e) => {
                  setSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[index].unit = e;
                    return newSlots;
                  });
                }}
                options={["AM", "PM"]}
              />
            </FormLayout.Group>
          </BlockStack>
        </Card>
      ))}
      <Button
        onClick={() => setSlots([...slots, initialState])}
        icon={PlusIcon}
      >
        Add more slots
      </Button>
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
            onClick={() => console.log(slots)}
            variant="primary"
            size="large"
            submit
          >
            Save & Next
          </Button>
        </ButtonGroup>
      </div>
    </FormLayout>
    // </Form>
  );
}
