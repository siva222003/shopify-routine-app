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
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useEffect, useState } from "react";
import prisma from "../db.server";
import ImageInput from "~/components/add-routine/ImageInput";
import ChannelsInput from "~/components/add-routine/ChannelsInput";
import DurationInput from "~/components/add-routine/DurationInput";
import { useForm } from "@rvf/remix";
import { addRoutineValidator } from "~/utils/validators";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  // const category = body.get("category") as string;
  // const type = body.get("type") as string;
  // const product = body.get("product") as string;

  const final = Object.fromEntries(body.entries());

  console.log(final);

  try {
    // const routine = await prisma.routine.create({
    //   data: { category, product, type },
    // });

    return json({
      success: true,
      // routine,
      final,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

export default function AdditionalPage() {
  const form = useForm({
    validator: addRoutineValidator,
  });

  const [type, setType] = useState("");

  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const actionData = useActionData<typeof action>();

  console.log(actionData);

  // useEffect(() => {
  //   if (actionData?.success) {
  //     setCategory("");
  //     setProduct("");
  //     setType("");
  //   }
  // }, [actionData?.success]);

  return (
    <Page narrowWidth>
      <TitleBar title="Add Routine" />
      <Layout>
        <Layout.Section>
          <Form method="post" {...form.getFormProps()}>
            <FormLayout>
              <Card>
                <TextField
                  autoComplete="off"
                  name="routineName"
                  label="Routine Name"
                  type="text"
                  value={type}
                  onChange={setType}
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
                <ImageInput />
              </Card>

              <Card>
                <BlockStack gap="200">
                  <TextField
                    name="category"
                    label="Category"
                    type="text"
                    autoComplete="off"
                    value={category}
                    onChange={setCategory}
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
                    value={product}
                    onChange={setProduct}
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
                <Button variant="primary" size="large" submit={true}>
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
