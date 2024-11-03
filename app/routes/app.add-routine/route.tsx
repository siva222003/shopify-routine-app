import {
  Layout,
  Page,
  FormLayout,
  Button,
  Card,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
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
import { addRoutine, fetchCategories, uploadImage } from "./api";
import { addRoutineValidator } from "./validator";
import { RoutineDefaultValues } from "./types";
import CategoryInputSkeleton from "~/components/add-routine/loaders/CategoryInputSkeleton";
import DescriptionInput from "~/components/add-routine/DescriptionInput";

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

  const res = await addRoutine(apiData);

  return res;
}

export default function AddRoutine() {
  const { categories } = useLoaderData<typeof loader>();

  console.log({ categories });

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
    <Page>
      <TitleBar title="Add Routine" />
      <Form {...form.getFormProps()}>
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
        <div
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Button loading={isSubmitting} variant="primary" size="large" submit>
            Submit
          </Button>
        </div>
      </Form>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <Page narrowWidth>
        <TitleBar title="Add Routine" />
        <h1>Error</h1>
        <p>{error.message}</p>
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
