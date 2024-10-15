import { Layout, Page, FormLayout, Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  ClientActionFunctionArgs,
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ImageInput from "~/components/add-routine/ImageInput";
import ChannelsInput from "~/components/add-routine/ChannelsInput";
import DurationInput from "~/components/add-routine/DurationInput";
import { useForm } from "@rvf/remix";
import { addRoutineValidator } from "~/utils/validators";
import CategoryInput from "~/components/add-routine/CategoryInput";
import RoutineInput from "~/components/add-routine/RoutineInput";
import DraftInput from "~/components/add-routine/DraftInput";
import { api } from "~/utils/axios";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { fetchCategories, uploadImage } from "./api";

export async function loader() {
  const categories = await fetchCategories();

  return categories;
}

export async function action({ request }: ActionFunctionArgs) {
  // const formData = await request.formData();

  // const final = Object.fromEntries(formData.entries());

  // const channels = JSON.parse(formData.get("channels") as string);

  // // final.duration = (final.duration as string) + " " + (final.unit as string);

  // // delete final.unit;

  // const data = {
  //   routineName: final.routineName as string,
  //   category: final.category as string,
  //   description: final.description as string,
  //   duration: final.duration as string,
  //   channels: channels,
  //   draft: final.draft === "true" ? true : false,
  // };

  // //Data for the routine api

  // const routineData = {
  //   name: data.routineName,
  //   visibility: "Public",
  //   description: data.description,
  //   image:
  //     "https://amrutam.co.in/cdn/shop/products/EyeKey-Malt-1-scaled_24e2b45f-c713-4ab1-bfcb-b72ba99b4600.jpg?v=1655351259&width=1000",
  //   duration: {
  //     number: final.duration as string,
  //     unit: final.unit as string,
  //   },
  //   category: data.category,
  //   channel: data.channels,
  //   draft: data.draft,
  //   isTemplate: true,
  // };

  // try {
  //   const response = await api.post("/admin/reminderlist", routineData);

  //   return json({
  //     success: true,
  //     data: response.data,
  //   });
  // } catch (error) {
  //   return json({ success: false, error });
  // }

  const formData = await request.formData();
  const intent = formData.get("intent");

  const file = formData.get("image") as File;

  const newData = new FormData();
  newData.append("file", file);

  try {
    const response = await uploadImage(newData);
    return json({ success: true, image: response, intent });
  } catch (error) {
    return json({ success: false, error });
  }
}

export async function clientAction({
  serverAction,
  context,
  request,
}: ClientActionFunctionArgs) {
  let data = await serverAction<any>();

  if (data.success) {
    if (data.intent === "upload") {
      shopify.toast.show("Imgae Uploaded successfully");
    } else {
      shopify.toast.show("Routine added successfully");
    }
  }

  return data;
}

export default function AddRoutine() {
  const { categories } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

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

  const submit = useSubmit();

  console.log(actionData);

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

  return (
    <Page narrowWidth>
      <TitleBar title="Add Routine" />
      <Layout>
        <Layout.Section>
          <Form {...form.getFormProps()} onSubmit={handleSubmit}>
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

              <DraftInput />

              <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                <Button
                  loading={isSubmitting}
                  variant="primary"
                  size="large"
                  submit
                >
                  Submit
                </Button>
              </div>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
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
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        {/* <p>The stack trace is:</p> */}
        {/* <pre>{error.stack}</pre> */}
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
