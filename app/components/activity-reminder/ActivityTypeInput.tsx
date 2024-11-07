import { FormApi } from "@rvf/remix";
import { BlockStack, Card, Select } from "@shopify/polaris";
import { ActivityReminderType } from "~/routes/app.$id.add-activity/validator";

interface ActivityTypeInputProps {
  form: FormApi<ActivityReminderType>;
}

const ActivityTypeInput = ({ form }: ActivityTypeInputProps) => {
  return (
    <Card>
      <BlockStack gap="600">
        <Select
          label="Activity Type"
          placeholder="Select"
          name="activityType"
          options={["mental", "physical"]}
          value={form.value("activityType")}
          onChange={(e) => form.setValue("activityType", e)}
          error={form.error("activityType") || undefined}
        />
      </BlockStack>
    </Card>
  );
};

export default ActivityTypeInput;
