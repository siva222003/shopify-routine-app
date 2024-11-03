import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, FormLayout, Page } from "@shopify/polaris";
import { useEffect } from "react";
import AddTimeSlot from "~/components/edit-routine/product-reminder/AddProductTimeSlot";
import AddProduct from "~/components/edit-routine/product-reminder/AddProduct";
import { useForm } from "@rvf/remix";
import { addProductValidator, DefaultProductReminderValues } from "./validator";
import { api } from "~/utils/axios";
import ProductTypeInput from "~/components/edit-routine/product-reminder/ProductTypeInput";
import DosageInput from "~/components/edit-routine/product-reminder/DosageInput";
import DurationInput from "~/components/edit-routine/product-reminder/DurationInput";
import Frequency from "~/components/edit-routine/product-reminder/Frequency";

export async function action({ request, params }: ActionFunctionArgs) {
  return json({ success: true });
}

const AddProductReminder = () => {
  const form = useForm({
    validator: addProductValidator,
    defaultValues: DefaultProductReminderValues,
    handleSubmit: async (values) => {
      console.log({ values });
      // submit({ values: JSON.stringify(values) }, { method: "POST" });
    },
  });

  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data) {
      if (data.success) {
        shopify.toast.show("Product Reminder added successfully");
      }
    }
  }, [data?.success]);

  const submit = useSubmit();

  return (
    <Page title="Add Product Reminder" narrowWidth>
      <Form {...form.getFormProps()}>
        <FormLayout>
          <AddProduct />
          <ProductTypeInput form={form} />
          <DosageInput form={form} />
          <DurationInput form={form} />
          <AddTimeSlot form={form} />
          <Frequency form={form} />
        </FormLayout>

        <Button submit>Save</Button>
      </Form>
    </Page>
  );
};

export default AddProductReminder;
