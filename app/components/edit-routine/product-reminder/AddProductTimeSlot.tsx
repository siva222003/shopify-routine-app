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
import { PlusIcon, DeleteIcon } from "@shopify/polaris-icons";
import { AddProductType, ProductReminderInitialSlots } from "~/types";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  product?: AddProductType;
  isActivity?: boolean;
  slots: ProductReminderInitialSlots[];
  setSlots: React.Dispatch<React.SetStateAction<ProductReminderInitialSlots[]>>;
  initialSlotsState: ProductReminderInitialSlots;
}
export default function AddMeals({
  setCurrentStep,
  product,
  slots,
  setSlots,
  initialSlotsState,
}: Props) {
  const [durationQty, setDurationQty] = useState("1");
  const [durationUnit, setDurationUnit] = useState("days");

  const options = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Brunch", value: "Brunch" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
  ];

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
        <InlineStack direction={"row-reverse"} gap="500">
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
                    checked={slot.mealTime === "beforeMeal"}
                    name="mealTime"
                    value="beforeMeal"
                    onChange={(e) => {
                      setSlots((prev) => {
                        const newSlots = [...prev];
                        newSlots[index].mealTime = "beforeMeal";
                        return newSlots;
                      });
                    }}
                  />
                  <RadioButton
                    label="After Meal"
                    name="mealTime"
                    value="afterMeal"
                    checked={slot.mealTime === "afterMeal"}
                    onChange={(e) => {
                      setSlots((prev) => {
                        const newSlots = [...prev];
                        newSlots[index].mealTime = "afterMeal";
                        return newSlots;
                      });
                    }}
                  />
                </InlineStack>
              )}
            </BlockStack>
          </Card>

          {slots.length > 1 && (
            <Button
              icon={DeleteIcon}
              variant="tertiary"
              tone="critical"
              onClick={() => {
                const newSlots = slots.filter((_, i) => i !== index);
                setSlots(newSlots);
              }}
              accessibilityLabel="Delete"
            />
          )}
        </InlineStack>
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
