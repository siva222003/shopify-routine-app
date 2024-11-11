import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
  useRouteError,
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
import GlobalErrorCard from "~/components/GlobalError";

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

  console.log(apiData.timeslotActivityBased);

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
      primaryAction={{
        content: "Save",
        onAction: form.submit,
        loading: isSubmitting,
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
      </Form>
      <div
        style={{
          marginTop: "3rem",
        }}
      ></div>
    </Page>
  );
};

export default AddActivityReminder;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Add Activity Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Add Activity Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
