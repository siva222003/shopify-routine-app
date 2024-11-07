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
import { useForm } from "@rvf/remix";
import { addActivityValidator } from "./validator";

import {
  DefaultActivityReminderValues,
  formattedActivityBasedTimeslots,
} from "./helper";
import { addActivityReminder } from "./api";
import {
  ActivityNameInput,
  ActivityTypeInput,
  AddActivityTimeSlot,
  DurationInput,
  Frequency,
  GoalInput,
} from "~/components/activity-reminder";
import { ImageInput } from "~/components/add-routine";

export async function action({ request, params }: ActionFunctionArgs) {
  const id = params.id;

  if (!id) {
    return json({ success: false, toast: "Routine ID is missing" });
  }

  const data = await request.formData();

  const values = JSON.parse(data.get("values") as string);

  const result = await addActivityValidator.validate(values);

  if (result.error) {
    return json({
      success: false,
      toast: "Invalid Fields",
    });
  }

  const apiData = result.data;

  (apiData.duration.number as any) = parseInt(apiData.duration.number);

  apiData.timeslotActivityBased = formattedActivityBasedTimeslots(
    apiData.timeslotActivityBased,
  ) as any;
  
  console.log(apiData.timeslotActivityBased)

  const response = await addActivityReminder({
    ...apiData,
    reminderListId: id,
  });

  return response;
}

const AddActivityReminder = () => {
  const form = useForm({
    validator: addActivityValidator,
    defaultValues: DefaultActivityReminderValues,
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
      title="Add Activity Reminder"
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
          <ActivityNameInput form={form} />
          <ActivityTypeInput form={form} />
          <ImageInput form={form} />
          <GoalInput form={form} />
          <DurationInput form={form} />
          <AddActivityTimeSlot form={form} />
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

export default AddActivityReminder;
