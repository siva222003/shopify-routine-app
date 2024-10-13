import {
  Layout,
  Page,
  FormLayout,
  Button,
  Card,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
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
import axios from "axios";
import { api } from "~/utils/axios";

export async function loader() {
  try {
    const categories = await api.get("/admin/category");
    return {
      success: true,
      categories: categories.data.data.docs,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  const channels = JSON.parse(formData.get("channels") as string);

  // final.duration = (final.duration as string) + " " + (final.unit as string);

  // delete final.unit;

  const data: Prisma.RoutineCreateInput = {
    routineName: final.routineName as string,
    category: final.category as string,
    description: final.description as string,
    duration: final.duration as string,
    channels: channels,
    draft: final.draft === "true" ? true : false,
  };

  //Data for the routine api

  const routineData = {
    name: data.routineName,
    visibility: "Public",
    description: data.description,
    image:
      "https://amrutam.co.in/cdn/shop/products/EyeKey-Malt-1-scaled_24e2b45f-c713-4ab1-bfcb-b72ba99b4600.jpg?v=1655351259&width=1000",
    duration: {
      number: final.duration as string,
      unit: final.unit as string,
    },
    category: data.category,
    channel: data.channels,
    draft: data.draft,
    isTemplate: true,
  };

  try {
    // const response = await prisma.routine.create({
    //   data,
    // });

    const response = await api.post("/admin/reminderlist", routineData);

    return json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function AdditionalPage() {
  const { categories } = useLoaderData<any>();

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

  console.log({ actionData });

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
