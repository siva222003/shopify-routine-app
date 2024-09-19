import { FieldValues, FormApi } from "@rvf/remix";
import { Card, TextField } from "@shopify/polaris";
import { DefaultRoutine } from "~/types";

interface Props {
  form: FormApi<DefaultRoutine>;
}

const RoutineInput = ({ form }: Props) => {
  return (
    <Card>
      <TextField
        autoComplete="off"
        name="routineName"
        label="Routine Name"
        type="text"
        value={form.value("routineName") || ""}
        onChange={(e) => form.setValue("routineName", e)}
        helpText={
          <span>
            We'll use this email address to inform you on future changes to
            Polaris.
          </span>
        }
        error={form.error("routineName") || undefined}
      />
    </Card>
  );
};

export default RoutineInput;
