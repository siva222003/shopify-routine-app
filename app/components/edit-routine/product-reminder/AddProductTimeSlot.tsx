import { FieldArray, FormApi, FormScope, useFieldArray } from "@rvf/remix";
import {
  Listbox,
  BlockStack,
  Card,
  InlineStack,
  Text,
  ButtonGroup,
  Button,
  Select,
  FormLayout,
  TextField,
  RadioButton,
  Box,
} from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { TimeSlot } from "~/routes/app.$id.add-product/types";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface Props {
  form: FormApi<ProductReminderType>;
}

export default function AddProductTimeSlot({ form }: Props) {
  const isConsumable = form.value("productType") === "consumable";

  const slots = useFieldArray(
    form.scope(
      isConsumable ? "timeSlotsConsumable" : "timeSlotsAppBased",
    ) as FormScope<TimeSlot[]>,
    {
      validationBehavior: {
        initial: "onChange",
        whenSubmitted: "onChange",
      },
    },
  );

  const handleAddSlot = () => {
    if (isConsumable) {
      slots.push(form.defaultValue("timeSlotsConsumable")![0]);
    } else {
      slots.push(form.defaultValue("timeSlotsAppBased")![0]);
    }
  };

  const renderSlotFields = (
    slot: any,
    index: number,
    isConsumable: boolean,
    key: string,
  ) => {
    const mealTypeError = isConsumable ? slot.error(`mealType`) : undefined;
    const hoursError = slot.error("hours") || undefined;
    const minutesError = slot.error("minutes") || undefined;
    const timeUnitError = slot.error("timeUnit") || undefined;

    return (
      <Box
        key={key}
        borderWidth="025"
        borderColor="border-disabled"
        borderStartStartRadius={index === 0 ? "200" : "0"}
        borderStartEndRadius={index === 0 ? "200" : "0"}
        padding="300"
      >
        <BlockStack gap="100">
          {isConsumable && (
            <Select
              label="Date range"
              options={["Breakfast", "Brunch", "Lunch", "Dinner"]}
              name={`timeSlotsConsumable[${index}].mealType`}
              placeholder="Select"
              onChange={(e) => slot.setValue(`mealType`, e)}
              value={slot.value(`mealType`)}
              error={mealTypeError}
            />
          )}
          <FormLayout.Group condensed>
            <TextField
              label="Hours"
              name={`timeSlots${isConsumable ? "Consumable" : "AppBased"}[${index}].hours`}
              type="text"
              maxLength={2}
              value={slot.value("hours")}
              onChange={(e) => {
                if (/^\d{0,2}$/.test(e)) {
                  slot.setValue("hours", e);
                }
              }}
              autoComplete="off"
              error={hoursError}
            />
            <TextField
              label="Minutes"
              name={`timeSlots${isConsumable ? "Consumable" : "AppBased"}[${index}].minutes`}
              type="text"
              maxLength={2}
              value={slot.value("minutes")}
              onChange={(e) => {
                if (/^\d{0,2}$/.test(e)) {
                  slot.setValue("minutes", e);
                }
              }}
              autoComplete="off"
              error={minutesError}
            />

            <Select
              label="AM/PM"
              placeholder="Select"
              name={`timeSlots${isConsumable ? "Consumable" : "AppBased"}[${index}].timeUnit`}
              value={slot.value("timeUnit")}
              onChange={(e) => slot.setValue("timeUnit", e as "")}
              options={["AM", "PM"]}
              error={timeUnitError}
            />
          </FormLayout.Group>
          <InlineStack gap="400">
            <RadioButton
              label="Before Meal"
              name={`timeSlots${isConsumable ? "Consumable" : "AppBased"}[${index}].mealTime`}
              value="beforeMeal"
              checked={slot.value("mealTime") === "beforeMeal"}
              onChange={() => slot.setValue(`mealTime`, "beforeMeal")}
            />
            <RadioButton
              label="After Meal"
              name={`timeSlots${isConsumable ? "Consumable" : "AppBased"}[${index}].mealTime`}
              value="afterMeal"
              checked={slot.value("mealTime") === "afterMeal"}
              onChange={() => slot.setValue(`mealTime`, "afterMeal")}
            />
          </InlineStack>
        </BlockStack>
        <InlineStack align="end">
          <Button
            variant="secondary"
            tone="critical"
            disabled={
              (isConsumable &&
                form.value("timeSlotsConsumable")?.length === 1) ||
              (!isConsumable && form.value("timeSlotsAppBased")?.length === 1)
            }
            onClick={() => {
              slots.remove(index);
              shopify.toast.show(`Slot ${index + 1} removed successfully`);
            }}
          >
            Delete
          </Button>
        </InlineStack>
      </Box>
    );
  };

  return (
    <Card>
      <Text as="h1" variant="headingXs">
        Time Slots
      </Text>
      <div style={{ marginTop: "10px" }}></div>
      <Listbox accessibilityLabel="Listbox with Action example">
        <FieldArray
          scope={
            form.scope(
              isConsumable ? "timeSlotsConsumable" : "timeSlotsAppBased",
            ) as FormScope<TimeSlot[]>
          }
        >
          {(array) =>
            array.map((key, item, index) =>
              renderSlotFields(item, index, isConsumable, key),
            )
          }
        </FieldArray>
        <Box
          padding="100"
          borderWidth="025"
          borderColor="border-disabled"
          borderEndStartRadius="200"
          borderEndEndRadius="200"
        >
          <ButtonGroup>
            <Button
              icon={PlusCircleIcon}
              onClick={handleAddSlot}
              variant="tertiary"
            >
              Add Slot
            </Button>
          </ButtonGroup>
        </Box>
      </Listbox>
    </Card>
  );
}
