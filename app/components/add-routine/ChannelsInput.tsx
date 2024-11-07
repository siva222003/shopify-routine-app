import { FormApi } from "@rvf/remix";
import { Banner, Card, OptionList } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { DefaultRoutine } from "~/routes/app.add-routine/validator";

interface Props {
  form: FormApi<DefaultRoutine>;
}

export default function MultipleOptionListExample({ form }: Props) {
  const [selected, setSelected] = useState<string[]>(form.value("channel"));

  const handleChange = (value: string[]) => {
    setSelected(value);
    form.setValue("channel", value);
  };

  useEffect(() => {
    form.setDirty(
      "channel",
      form.value("channel").length !== form.defaultValue("channel").length,
    );

    setSelected(form.value("channel"));
  }, [form.value("channel")]);

  return (
    <Card>
      <OptionList
        id="channels"
        title="Select Reminder Channels"
        onChange={(value) => {
          handleChange(value);
        }}
        options={[
          { value: "sms", label: "SMS" },
          { value: "whatsapp", label: "WhatsApp" },
        ]}
        selected={selected || []}
        allowMultiple
      />

      {form.error("channel") && (
        <Banner title="Select atleast one channel" tone="critical"></Banner>
      )}

      {form.value("channel").map((channel) => (
        <input key={channel} type="hidden" name="channel" value={channel} />
      ))}
    </Card>
  );
}
