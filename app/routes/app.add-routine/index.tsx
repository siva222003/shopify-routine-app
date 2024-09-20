import {
  Layout,
  Page,
  FormLayout,
  Button,
  Card,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import prisma from "../../db.server";
import ImageInput from "~/components/add-routine/ImageInput";
import ChannelsInput from "~/components/add-routine/ChannelsInput";
import DurationInput from "~/components/add-routine/DurationInput";
import { useForm } from "@rvf/remix";
import { addRoutineValidator } from "~/utils/validators";
import CategoryInput from "~/components/add-routine/CategoryInput";
import RoutineInput from "~/components/add-routine/RoutineInput";
import DraftInput from "~/components/add-routine/DraftInput";
import { Prisma } from "@prisma/client";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  const channels = JSON.parse(formData.get("channels") as string);

  final.duration = (final.duration as string) + " " + (final.unit as string);

  delete final.unit;

  const data: Prisma.RoutineCreateInput = {
    routineName: final.routineName as string,
    category: final.category as string,
    description: final.description as string,
    duration: final.duration as string,
    channels: channels,
    draft: final.draft === "true" ? true : false,
  };

  try {
    const response = await prisma.routine.create({
      data,
    });

    return json({
      success: true,
      data: data,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function AdditionalPage() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "submitting";
  const isPageLoading = navigation.state === "loading";

  const [file, setFile] = useState<File | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [isChannelsError, setChannelsError] = useState<string | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
    defaultValues: {
      routineName: "",
      description: "",
      category: "",
      duration: "",
      unit: "",
    },
  });

  const actionData = useActionData<typeof action>();

  console.log(actionData);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await form.validate();

    if (selectedOptions.length === 0) {
      setChannelsError("Please select at least one channel");
      return;
    }

    if (Object.keys(isValid).length === 0) {
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      formData.append("channels", JSON.stringify(selectedOptions));

      submit(formData, { method: "post" });
    }
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        shopify.toast.show("Routine added successfully");
      }
    }
  }, [actionData?.success]);

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
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                isChannelsError={isChannelsError}
                setChannelsError={setChannelsError}
              />

              <DraftInput />

              <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                <Button
                  loading={isLoading}
                  variant="primary"
                  size="large"
                  submit
                >
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
