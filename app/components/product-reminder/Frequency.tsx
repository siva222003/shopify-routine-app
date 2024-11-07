import { FormApi } from "@rvf/remix";
import { Banner, Card, OptionList } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<ProductReminderType>;
}

export default function Frequency({ form }: Props) {
  const [selected, setSelected] = useState<string[]>(form.value("frequency"));

  const handleChange = (value: string[]) => {
    setSelected(value);
    form.setValue("frequency", value);
  };

  useEffect(() => {
    form.setDirty(
      "frequency",
      form.value("frequency").length !== form.defaultValue("frequency").length,
    );

    setSelected(form.value("frequency"));
  }, [form.value("frequency")]);

  return (
    <Card>
      <OptionList
        id="frequency"
        title="Select Frequency"
        onChange={(value) => {
          handleChange(value);
        }}
        options={[
          { value: "Sunday", label: "Sunday" },
          { value: "Monday", label: "Monday" },
          { value: "Tuesday", label: "Tuesday" },
          { value: "Wednesday", label: "Wednesday" },
          { value: "Thursday", label: "Thursday" },
          { value: "Friday", label: "Friday" },
          { value: "Saturday", label: "Saturday" },
        ]}
        selected={selected || []}
        allowMultiple
      />

      {form.error("frequency") && (
        <Banner title="Select atleast one day" tone="critical"></Banner>
      )}

      {form.value("frequency").map((frequency) => (
        <input
          onChange={() => {}}
          key={frequency}
          type="hidden"
          name="frequency"
          value={frequency}
        />
      ))}
    </Card>
  );
}
