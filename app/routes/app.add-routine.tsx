import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  FormLayout,
  Button,
  Checkbox,
  TextField,
  Select,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { FormEvent, useCallback, useEffect, useState } from "react";
import prisma from "../db.server";
import ImageInput from "~/components/add-routine/ImageInput";
import ChannelsInput from "~/components/add-routine/ChannelsInput";
import DurationInput from "~/components/add-routine/DurationInput";
import { useForm } from "@rvf/remix";
import { addRoutineValidator } from "~/utils/validators";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const final = Object.fromEntries(body.entries());

  try {
    // const routine = await prisma.routine.create({
    //   data: { category, product, type },
    // });

    return json({
      success: true,
      final,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function AdditionalPage() {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    validator: addRoutineValidator,
  });

  const actionData = useActionData<typeof action>();

  console.log(actionData);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = await form.validate();

    if (Object.keys(isValid).length === 0) {
      
      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      formData.append("image", "image");

      submit(formData, { method: "post" });
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar title="Add Routine" />
      <Layout>
        <Layout.Section>
          <form {...form.getFormProps()} onSubmit={handleSubmit}>
            <FormLayout>
              <Card>
                <TextField
                  autoComplete="off"
                  name="routineName"
                  label="Routine Name"
                  type="text"
                  value={form.value("routineName") || ""}
                  onChange={(e) => form.setValue("routineName", e)}
                  helpText={
                    <span>
                      We'll use this email address to inform you on future
                      changes to Polaris.
                    </span>
                  }
                  error={form.error("routineName") || undefined}
                />
              </Card>

              <Card>
                <ImageInput file={file} setFile={setFile} />
              </Card>

              <Card>
                <BlockStack gap="200">
                  <TextField
                    name="category"
                    label="Category"
                    type="text"
                    autoComplete="off"
                    value={form.value("category") || ""}
                    onChange={(e) => form.setValue("category", e)}
                    helpText={
                      <span>
                        We'll use this email address to inform you on future
                        changes to Polaris.
                      </span>
                    }
                    error={form.error("category") || undefined}
                  />

                  <TextField
                    name="description"
                    label="Description"
                    type="text"
                    autoComplete="off"
                    value={form.value("description") || ""}
                    onChange={(e) => form.setValue("description", e)}
                    multiline={6}
                    helpText={
                      <span>
                        We'll use this email address to inform you on future
                        changes to Polaris.
                      </span>
                    }
                    error={form.error("description") || undefined}
                  />
                </BlockStack>
              </Card>

              <DurationInput form={form} />

              <ChannelsInput form={form} />

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
