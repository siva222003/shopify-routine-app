import { Layout, Page, FormLayout, Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useState } from "react";
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

export async function loader() {
  const categories = await fetchCategories();

  return categories;
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

  return json({ result: res });
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

  console.log(actionData);

  console.log(form.formState.fieldErrors);

  const submit = useSubmit();

  return (
    <Page>
      <TitleBar title="Add Routine" />
      <Form {...form.getFormProps()}>
        <Layout>
          <Layout.Section>
            <FormLayout>
              <RoutineInput form={form} />

              <CategoryInput form={form} catgories={categories} />

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
