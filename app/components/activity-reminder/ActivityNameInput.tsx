import { FormApi } from "@rvf/remix";
import { Card, TextField } from "@shopify/polaris";
import { ActivityReminderType } from "~/routes/app.$id.add-activity/validator";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<ActivityReminderType>;
}

const ActivityNameInput = ({ form }: Props) => {
  return (
    <Card>
      <TextField
        autoComplete="off"
        name="name"
        label="Activity Name"
        type="text"
        value={form.value("name") || ""}
        onChange={(e) => form.setValue("name", e)}
        helpText={
          <span>
            The name of the routine. This will be displayed on the routine page.
          </span>
        }
        error={form.error("name") || undefined}
      />
    </Card>
  );
};

export default ActivityNameInput;
