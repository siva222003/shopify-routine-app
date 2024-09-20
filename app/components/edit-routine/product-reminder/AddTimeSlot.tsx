import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  InlineStack,
  RadioButton,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useMemo, useState } from "react";
import { PlusIcon } from "@shopify/polaris-icons";
import { AddProductType } from "~/types";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  product?: AddProductType;
  isActivity?: boolean;
}
export default function AddMeals({
  setCurrentStep,
  product,
  isActivity,
}: Props) {
  const [durationQty, setDurationQty] = useState("1");
  const [durationUnit, setDurationUnit] = useState("days");

  const options = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Snacks", value: "snacks" },
    { label: "Dinner", value: "dinner" },
  ];

  const initialSlotsState = useMemo(() => {
    if (!isActivity && product?.productType === "consumable") {
      return {
        mealType: "",
        hours: "",
        minutes: "",
        timeUnit: "AM",
        mealTime: "before",
      };
    } else {
      return {
        hours: "",
        minutes: "",
        timeUnit: "AM",
      };
    }
  }, []);

  const [slots, setSlots] = useState([initialSlotsState]);

  const handleAddSlot = () => {
    if (slots) setSlots([...slots, initialSlotsState]);
  };

  return (
    <FormLayout>
      <Text as="h1" variant="headingMd">
        Duration
      </Text>
      <Card>
        <FormLayout.Group condensed>
          <TextField
            label="Duration"
            name="durationQty"
            type="number"
            min={1}
            value={durationQty}
            onChange={setDurationQty}
            autoComplete="off"
          />
          <Select
            label="Unit"
            placeholder="Select"
            name="durationUnit"
            options={["days", "weeks", "months", "years"]}
            value={durationUnit}
            onChange={setDurationUnit}
          />
        </FormLayout.Group>
      </Card>

      <Text as="h1" variant="headingMd">
        Time Slots
      </Text>

      {slots.map((slot, index) => (
        <Card key={index}>
          <BlockStack gap="300">
            {product?.productType === "consumable" && (
              <Select
                label="Date range"
                options={options}
                name="mealType"
                onChange={(e) => {
                  setSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[index].mealType = e;
                    return newSlots;
                  });
                }}
                value={slot.mealType}
              />
            )}

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
                value={slot.timeUnit}
                onChange={(e) => {
                  setSlots((prev) => {
                    const newSlots = [...prev];
                    newSlots[index].timeUnit = e;
                    return newSlots;
                  });
                }}
                options={["AM", "PM"]}
              />
            </FormLayout.Group>

            {product?.productType === "consumable" && (
              <InlineStack gap="400">
                <RadioButton
                  label="Before Meal"
                  checked={slot.mealTime === "before"}
                  name="mealTime"
                  value="before"
                  onChange={(e) => {
                    setSlots((prev) => {
                      const newSlots = [...prev];
                      newSlots[index].mealTime = "before";
                      return newSlots;
                    });
                  }}
                />
                <RadioButton
                  label="After Meal"
                  name="mealTime"
                  value="after"
                  checked={slot.mealTime === "after"}
                  onChange={(e) => {
                    setSlots((prev) => {
                      const newSlots = [...prev];
                      newSlots[index].mealTime = "after";
                      return newSlots;
                    });
                  }}
                />
              </InlineStack>
            )}
          </BlockStack>
        </Card>
      ))}
      <Button onClick={handleAddSlot} icon={PlusIcon}>
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
            // onClick={() => console.log(slots)}
            variant="primary"
            size="large"
            submit
          >
            Save & Next
          </Button>
        </ButtonGroup>
      </div>
    </FormLayout>
  );
}
