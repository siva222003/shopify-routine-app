import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { Button, FormLayout, Page } from "@shopify/polaris";
import { useEffect } from "react";
import {
  AddProduct,
  AddProductTimeSlot,
  DosageInput,
  DurationInput,
  Frequency,
  ProductTypeInput,
} from "~/components/product-reminder";
import { useForm } from "@rvf/remix";
import { addProductValidator } from "./validator";
import {
  DefaultProductReminderValues,
  formattedAppBasedTimeslots,
  formattedConsumableTimeslots,
} from "./helper";
import { addProductReminder } from "./api";

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id;

  if (!id) {
    return json({ success: false, toast: "Routine ID is missing" });
  }

  const data = await request.formData();

  const values = JSON.parse(data.get("values") as string);

  const result = await addProductValidator.validate(values);

  if (result.error) {
    return json({
      success: false,
      toast: "Invalid Fields",
    });
  }

  const apiData = result.data;

  (apiData.duration.number as any) = parseInt(apiData.duration.number);

  apiData.timeSlotsConsumable = formattedConsumableTimeslots(
    apiData.timeSlotsConsumable,
  ) as any;

  apiData.timeSlotsAppBased = formattedAppBasedTimeslots(
    apiData.timeSlotsAppBased,
  ) as any;

  const response = await addProductReminder({ ...apiData, reminderListId: id });

  return response;
}

const AddProductReminder = () => {
  const form = useForm({
    validator: addProductValidator,
    defaultValues: DefaultProductReminderValues,
    handleSubmit: async (values) => {
      console.log({ values });
      submit({ values: JSON.stringify(values) }, { method: "POST" });
    },
  });

  const actionData = useActionData<typeof action>();

  const navigaton = useNavigation();

  const navigate = useNavigate();

  const { id } = useParams();

  const isSubmitting = navigaton.state === "submitting";

  const submit = useSubmit();

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 3000,
        isError: !actionData.success,
      });
    }
  }, [actionData]);

  return (
    <Page
      title="Add Product Reminder"
      backAction={{
        content: "Back",
        onAction: () => {
          navigate(`/app/${id}/reminder`);
        },
      }}
      narrowWidth
    >
      <Form {...form.getFormProps()}>
        <FormLayout>
          <AddProduct form={form} />
          <ProductTypeInput form={form} />
          <DosageInput form={form} />
          <DurationInput form={form} />
          <AddProductTimeSlot form={form} />
          <Frequency form={form} />
        </FormLayout>

        <div
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Button
            variant="primary"
            size="large"
            submit
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Page>
  );
};

export default AddProductReminder;
