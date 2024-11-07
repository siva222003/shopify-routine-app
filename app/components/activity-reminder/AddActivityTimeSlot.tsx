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
import { ActivityReminderType } from "~/routes/app.$id.add-activity/validator";

interface Props {
  form: FormApi<ActivityReminderType>;
}

export default function AddActivityTimeSlot({ form }: Props) {
  const slots = useFieldArray(form.scope("timeslotActivityBased"), {
    validationBehavior: {
      initial: "onChange",
      whenSubmitted: "onChange",
    },
  });

  const handleAddSlot = () => {
    slots.push({
      hours: "",
      minutes: "",
      timeUnit: "AM",
    });
  };

  const renderSlotFields = (slot: any, index: number, key: string) => {
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
          <FormLayout.Group condensed>
            <TextField
              label="Hours"
              name={`timeslotActivityBased[${index}].hours`}
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
              name={`timeslotActivityBased[${index}].minutes`}
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
              name={`timeslotActivityBased[${index}].timeUnit`}
              value={slot.value("timeUnit")}
              onChange={(e) => slot.setValue("timeUnit", e as "")}
              options={["AM", "PM"]}
              error={timeUnitError}
            />
          </FormLayout.Group>
        </BlockStack>

        <div
          style={{
            marginTop: "13px",
          }}
        ></div>
        <InlineStack align="end">
          <Button
            variant="secondary"
            tone="critical"
            disabled={form.value("timeslotActivityBased").length === 1}
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
        <FieldArray scope={form.scope("timeslotActivityBased")}>
          {(array) =>
            array.map((key, item, index) => renderSlotFields(item, index, key))
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
