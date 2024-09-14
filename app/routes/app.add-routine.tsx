import {
  Card,
  Layout,
  Page,
  BlockStack,
  FormLayout,
  Button,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useActionData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { FormEvent, useCallback, useEffect, useState } from "react";
import prisma from "../db.server";
import ImageInput from "~/components/add-routine/ImageInput";
import ChannelsInput from "~/components/add-routine/ChannelsInput";
import DurationInput from "~/components/add-routine/DurationInput";
import { useForm } from "@rvf/remix";
import { addRoutineValidator } from "~/utils/validators";
import CategoryInput from "~/components/add-routine/CategoryInput";
import RoutineInput from "~/components/add-routine/RoutineInput";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  const channels = JSON.parse(formData.get("channels") as string);

  final.channels = channels;

  try {
    // const routine = await prisma.routine.create({
    //   data: { category, product, type },
    // });

    return json({
      success: true,
      data: final,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function AdditionalPage() {
  const [file, setFile] = useState<File | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [isChannelsError, setChannelsError] = useState<string | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
  });

  const actionData = useActionData<typeof action>();

  console.log(actionData);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await form.validate();

    if (selectedOptions.length === 0) {
      setChannelsError("Please select at least one channel");
    }

    console.log(selectedOptions);

    if (Object.keys(isValid).length === 0) {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      formData.append("channels", JSON.stringify(selectedOptions));

      submit(formData, { method: "post", encType: "multipart/form-data" });
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar title="Add Routine" />
      <Layout>
        <Layout.Section>
          <form {...form.getFormProps()} onSubmit={handleSubmit}>
            <FormLayout>
              <RoutineInput form={form} />

              <ImageInput file={file} setFile={setFile} />

              <CategoryInput form={form} />

              <DurationInput form={form} />

              <ChannelsInput
                form={form}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                isChannelsError={isChannelsError}
              />

              <div style={{ marginBottom: "20px" }}>
                <Button variant="primary" size="large" submit>
                  Submit
                </Button>
              </div>
            </FormLayout>
          </form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
