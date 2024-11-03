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
  Grid,
  Badge,
} from "@shopify/polaris";
import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
import {
  Link,
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
  Await,
} from "@remix-run/react";
import {
  CategoryInput,
  ChannelsInput,
  DurationInput,
  ImageInput,
  RoutineInput,
  StatusInput,
} from "~/components/add-routine";
import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { startTransition, Suspense, useEffect, useState } from "react";
import { useForm, validationError } from "@rvf/remix";
import { addRoutineValidator } from "../app.add-routine/validator";
import { EditRoutineDefaultValues, EditRoutineType } from "./types";
import ProductReminderCard from "~/components/edit-routine/ui/ProductReminderCard";
import ActivityReminderCard from "~/components/edit-routine/ui/ActivityReminderCard";
import NoRoutines from "~/components/edit-routine/ui/NoRoutines";
import DescriptionInput from "~/components/add-routine/DescriptionInput";
import RoutineFormSkeleton from "~/components/edit-routine/loaders/RoutineFormSkeleton";
import { deleteRoutine, fetchRoutine, updateRoutine } from "./api";
import { fetchCategories } from "../app.add-routine/api";
import CategoryInputSkeleton from "~/components/add-routine/loaders/CategoryInputSkeleton";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error("Routine ID is required");
  }

  console.log({ params: params.id });

  const routinePromise = fetchRoutine(params.id);
  const categoriesPromise = fetchCategories();

  return defer({
    routinePromise,
    categoriesPromise,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id;

  if (!id) {
    return;
  }

  const data = await request.formData();

  const _action = JSON.parse(data.get("_action") as string);

  if (_action === "delete") {
    const response = await deleteRoutine(id);
    return response;
  } else if (_action === "update") {
    const values = JSON.parse(data.get("values") as string);

    const result = await addRoutineValidator.validate(values);
    if (result.error) {
      return json({ success: false, toast: "Invalid fields" });
    }

    const apiData = result.data;

    apiData.draft === "draft"
      ? ((apiData.draft as any) = true)
      : ((apiData.draft as any) = false);

    (apiData.duration.number as any) = parseInt(apiData.duration.number);

    const response = await updateRoutine(id, apiData);

    return response;
  }
}

export default function Routine() {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [showSaveBar, setShowSaveBar] = useState(false);

  const { routinePromise, categoriesPromise } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [resolvedRoutineData, setResolvedRoutineData] =
    useState<EditRoutineType | null>(null);

  useEffect(() => {
    if (routinePromise) {
      routinePromise.then((data) => {
        startTransition(() => {
          setResolvedRoutineData(data.data);
          form.resetForm(EditRoutineDefaultValues(data.data));
        });
      });
    }
  }, [routinePromise]);

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 5000,
        isError: !actionData.success,
      });

      setShowSaveBar(false);

      if (
        actionData.success &&
        actionData.toast === "Routine deleted successfully"
      ) {
        navigate(`/app/routine-list/1`);
      }
    }
  }, [actionData]);

  const isSubmitting = navigation.state === "submitting";

  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
    defaultValues: EditRoutineDefaultValues(resolvedRoutineData),
    handleSubmit: async (values) => {
      submit(
        { values: JSON.stringify(values), _action: JSON.stringify("update") },
        { method: "PUT" },
      );
    },
  });

  console.log({ form: form.value("channel") });

  useEffect(() => {
    if (form.formState.isDirty) {
      setShowSaveBar(true);
    } else {
      setShowSaveBar(false);
    }
  }, [form.formState.isDirty]);

  const submit = useSubmit();

  const { id } = useParams();

  return (
    <Page
      title="Customize Routine"
      backAction={{
        content: "Back",
        onAction: () => navigate(`/app/routine-list/1`),
      }}
      titleMetadata={
        <Badge tone={form.value("draft") === "draft" ? "info" : "success"}>
          {form.value("draft")}
        </Badge>
      }
      primaryAction={{
        content: "Delete",
        destructive: true,
        onAction: () => {
          submit({ _action: JSON.stringify("delete") }, { method: "delete" });
        },
        loading: isSubmitting,

        disabled: isSubmitting,
      }}
    >
      <Suspense fallback={<RoutineFormSkeleton />}>
        <Await
          resolve={routinePromise}
          errorElement={<p>Some Error Occured</p>}
        >
          {(resolvedData) => (
            <Form {...form.getFormProps()}>
              {/* Save Bar */}
              <SaveBar open={showSaveBar}>
                <button
                  type="submit"
                  loading={isSubmitting}
                  variant="primary"
                  id="save-button"
                >
                  Save
                </button>
                <button
                  onClick={() =>
                    form.resetForm(
                      EditRoutineDefaultValues(resolvedRoutineData),
                    )
                  }
                  type="button"
                  id="discard-button"
                >
                  Discard
                </button>
              </SaveBar>

              <Layout>
                <Layout.Section>
                  <FormLayout>
                    <RoutineInput form={form} />
                    <Card>
                      <BlockStack gap="200">
                        <Suspense fallback={<CategoryInputSkeleton />}>
                          <Await
                            resolve={categoriesPromise}
                            errorElement={<p>Some Error Occured</p>}
                          >
                            {(categories) => (
                              <CategoryInput
                                form={form}
                                categories={categories.data.docs}
                              />
                            )}
                          </Await>
                        </Suspense>
                        <DescriptionInput form={form} />
                      </BlockStack>
                    </Card>
                    <DurationInput form={form} />
                    <ImageInput file={file} setFile={setFile} />
                    <ChannelsInput form={form} />
                  </FormLayout>
                </Layout.Section>

                <Layout.Section variant="oneThird">
                  <FormLayout>
                    <StatusInput form={form} />
                  </FormLayout>
                </Layout.Section>
              </Layout>
            </Form>
          )}
        </Await>
      </Suspense>

      {(resolvedRoutineData &&
        resolvedRoutineData.productReminders.length > 0) ||
      (resolvedRoutineData &&
        resolvedRoutineData.activityReminders.length > 0) ? (
        <>
          <div style={{ marginTop: "30px" }}></div>
          <Text as="h1" variant="headingLg">
            Reminders
          </Text>
          <div style={{ marginTop: "30px" }}></div>
          <Grid gap={{ lg: "20px" }}>
            {resolvedRoutineData?.productReminders.map((reminder) => (
              <Grid.Cell
                key={reminder._id}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
              >
                <ProductReminderCard reminder={reminder} />
              </Grid.Cell>
            ))}
            {resolvedRoutineData?.activityReminders.map((reminder) => (
              <Grid.Cell
                key={reminder._id}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
              >
                <ActivityReminderCard reminder={reminder} />
              </Grid.Cell>
            ))}
          </Grid>
          <div style={{ marginTop: "30px" }}></div>
          <InlineStack align="end">
            <Button onClick={() => navigate(`/app/${id}/reminder`)}>
              Add Reminder
            </Button>
          </InlineStack>
        </>
      ) : (
        <>
          <div style={{ marginTop: "30px" }}></div>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <NoRoutines id={id!} />
            </Grid.Cell>
          </Grid>
        </>
      )}
      <div style={{ marginTop: "30px" }}></div>
    </Page>
  );
}
