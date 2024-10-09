import {
  Layout,
  Page,
  FormLayout,
  Button,
  Card,
  InlineStack,
  BlockStack,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { FormEvent, useCallback, useEffect, useState } from "react";
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
import { PlusIcon } from "@shopify/polaris-icons";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const response = await prisma.routine.findUnique({
      where: {
        id: params.id,
      },
    });

    return json({
      success: true,
      data: response,
    });
  } catch (error) {
    return json({ success: false, data: null });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
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
    const response = await prisma.routine.update({
      where: {
        id: params.id,
      },
      data,
    });

    return json({
      success: true,
      data: response,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function Routine() {
  const navigation = useNavigation();

  const navigate = useNavigate();

  const { data } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const isLoading = navigation.state === "submitting";

  const [file, setFile] = useState<File | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    data?.channels || [],
  );

  const [isChannelsError, setChannelsError] = useState<string | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
    defaultValues: {
      routineName: data?.routineName!,
      category: data?.category!,
      description: data?.description!,
      duration: data?.duration.split(" ")[0]!,
      unit: data?.duration.split(" ")[1]!,
    },
  });

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        shopify.toast.show("Routine updated successfully");
      }
    }
  }, [actionData?.success]);

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

  const { id } = useParams();

  return (
    <Page narrowWidth>
      <TitleBar title="Customize Routine" />
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

              <DraftInput draftValue={data?.draft} />

              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Reminders
                    </Text>
                    <Button
                      onClick={() => navigate(`/app/${id}/reminder`)}
                      accessibilityLabel="Add variant"
                      icon={PlusIcon}
                    >
                      Add
                    </Button>
                  </InlineGrid>
                  <Text as="p" variant="bodyMd">
                    Add items for your routine.
                  </Text>
                </BlockStack>
              </Card>

              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Weekly Benfits
                    </Text>
                    <Button
                      onClick={() => navigate(`/app/${id}/weekly-benfits`)}
                      accessibilityLabel="Add variant"
                      icon={PlusIcon}
                    >
                      Add
                    </Button>
                  </InlineGrid>
                  <Text as="p" variant="bodyMd">
                    Add weekly benefits of this Routine so that users can tally
                    the progress
                  </Text>
                </BlockStack>
              </Card>

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
