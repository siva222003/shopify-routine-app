import { FormApi } from "@rvf/remix";
import { Card, TextField } from "@shopify/polaris";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
}

const RoutineInput = ({ form }: Props) => {
  return (
    <Card>
      <TextField
        autoComplete="off"
        name="name"
        label="Routine Name"
        type="text"
        value={form.value("name") || ""}
        onChange={(e) => form.setValue("name", e)}
        error={form.error("name") || undefined}
      />
    </Card>
  );
};

export default RoutineInput;
