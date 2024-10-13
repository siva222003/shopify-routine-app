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
  Link,
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
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import { api } from "~/utils/axios";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const response = await api.get(`admin/reminderlist/${params.id}`);
    const categories = await api.get("/admin/category");

    return json({
      success: true,
      data: response.data.data,
      categories: categories.data.data.docs,
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
  const { data, categories } = useLoaderData<typeof loader>();
  console.log(data);
  const actionData = useActionData<typeof action>();
  const isLoading = navigation.state === "submitting";
  const [file, setFile] = useState<File | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    data?.channel || [],
  );
  const [isChannelsError, setChannelsError] = useState<string | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
    defaultValues: {
      routineName: data?.name!,
      category: data?.category._id!,
      description: data?.description!,
      duration: data?.duration.number!,
      unit: data?.duration.unit!,
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
              <CategoryInput form={form} catgories={categories} />
              <DurationInput form={form} />
              <ChannelsInput
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                isChannelsError={isChannelsError}
                setChannelsError={setChannelsError}
              />
              <DraftInput draftValue={data?.draft} />
              {data?.productReminders && data?.productReminders.length > 0 && (
                <Text as="h2" variant="headingMd">
                  Product Reminders
                </Text>
              )}
              {data?.productReminders.map((reminder) => {
                return (
                    <Card roundedAbove="sm" key={reminder.id}>
                      <BlockStack gap="200">
                        <InlineGrid columns="1fr auto">
                          <Text as="h2" variant="headingSm">
                            {reminder.name}
                          </Text>
                          <Button
                            onClick={() => navigate(`/app/${id}/reminder`)}
                            accessibilityLabel="Add variant"
                            icon={PlusIcon}
                          >
                            Edit
                          </Button>
                        </InlineGrid>
                        <Text as="p" variant="bodyMd">
                          {reminder.productType}
                        </Text>
                      </BlockStack>
                    </Card>
                
           
                );
              })}

              {data?.activityReminders &&
                data?.activityReminders.length > 0 && (
                  <Text as="h2" variant="headingMd">
                    Activity Reminders
                  </Text>
                )}
              {data?.activityReminders.map((reminder) => {
                return (
                  <Card roundedAbove="sm" key={reminder.id}>
                    <BlockStack gap="200">
                      <InlineGrid columns="1fr auto">
                        <Text as="h2" variant="headingSm">
                          {reminder.name}
                        </Text>
                        <Button
                          onClick={() => navigate(`/app/${id}/reminder`)}
                          accessibilityLabel="Add variant"
                          icon={PlusIcon}
                        >
                          Edit
                        </Button>
                      </InlineGrid>
                      <Text as="p" variant="bodyMd">
                        {reminder.activityType}
                      </Text>
                    </BlockStack>
                  </Card>
                );
              })}

              {
                <Link to={`/app/${id}/reminder`}>
                  <Button>Add Reminders</Button>
                </Link>
              }

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
