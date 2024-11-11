import { Layout, Page, FormLayout, Card, BlockStack } from "@shopify/polaris";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useRouteError,
  isRouteErrorResponse,
  Await,
} from "@remix-run/react";
import { ActionFunctionArgs, defer, json } from "@remix-run/node";
import { Suspense, useEffect, useState } from "react";
import { useForm, validationError } from "@rvf/remix";
import {
  CategoryInput,
  ChannelsInput,
  DurationInput,
  ImageInput,
  RoutineInput,
  StatusInput,
} from "~/components/add-routine";
import { addRoutine, fetchCategories } from "./api";
import { addRoutineValidator } from "./validator";
import { RoutineDefaultValues } from "./types";
import CategoryInputSkeleton from "~/components/add-routine/loaders/CategoryInputSkeleton";
import DescriptionInput from "~/components/add-routine/DescriptionInput";
import GlobalErrorCard from "~/components/GlobalError";

export async function loader() {
  const categoriesPromise = fetchCategories();

  return defer({ categories: categoriesPromise });
}

export async function action({ request }: ActionFunctionArgs) {
  const final = await request.formData();
  const values = JSON.parse(final.get("values") as string);

  const result = await addRoutineValidator.validate(values);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const apiData = result.data;

  apiData.draft === "draft"
    ? ((apiData.draft as any) = true)
    : ((apiData.draft as any) = false);
  (apiData.duration.number as any) = parseInt(apiData.duration.number);

  const res = await addRoutine({ ...apiData, isTemplate: true });

  return res;
}

export default function AddRoutine() {
  const { categories } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
    defaultValues: RoutineDefaultValues,
    handleSubmit: async (values) => {
      submit({ values: JSON.stringify(values) }, { method: "POST" });
    },
  });

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if ((actionData as any)?.success !== undefined) {
      shopify.toast.show((actionData as any)?.toast ?? "Success", {
        isError: !(actionData as any)?.success,
        duration: 3000,
      });
    }
  }, [actionData]);

  const submit = useSubmit();

  return (
    <Page
      title="Add Routine"
      primaryAction={{
        content: "Save",
        onAction: form.submit,
        loading: isSubmitting,
      }}
    >
      <Form {...form.getFormProps()}>
        {/* <SaveBar open={form.formState.isDirty}>
          <button variant={"primary"} onClick={() => form.submit}>
            {isSubmitting ? <Spinner size="small" /> : null}
            Save
          </button>
          <button
            type="button"
            onClick={() => form.resetForm(RoutineDefaultValues)}
          >
            Discard
          </button>
        </SaveBar> */}

        <Layout>
          <Layout.Section>
            <FormLayout>
              <RoutineInput form={form} />
              <Card>
                <BlockStack gap="200">
                  <Suspense fallback={<CategoryInputSkeleton />}>
                    <Await
                      resolve={categories}
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

              <ChannelsInput form={form} />
            </FormLayout>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <FormLayout>
              <ImageInput form={form} />

              <StatusInput form={form} />
            </FormLayout>
          </Layout.Section>
        </Layout>

        <div
          style={{
            marginTop: "3rem",
          }}
        ></div>
      </Form>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Add Routine">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Add Routine">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
