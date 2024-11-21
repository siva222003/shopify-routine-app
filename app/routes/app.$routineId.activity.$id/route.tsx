import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Await,
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import { Button, FormLayout, Page } from "@shopify/polaris";
import { startTransition, Suspense, useEffect, useState } from "react";
import { useForm } from "@rvf/remix";
import { addActivityValidator } from "~/routes/app.$id.add-activity/validator";

import { formattedActivityBasedTimeslots } from "~/routes/app.$id.add-activity/helper";
import { updateActivityReminder, fetchActivityReminder } from "./api";
import { EditActivityReminderType } from "./types";
import {
  ActivityNameInput,
  ActivityTypeInput,
  AddActivityTimeSlot,
  DurationInput,
  Frequency,
  GoalInput,
} from "~/components/activity-reminder";
import { EditActivityReminderDefaultValues } from "./helper";
import { ImageInput } from "~/components/add-routine";
import { deleteActivityReminder } from "../app.routine.$id/api";
import GlobalErrorCard from "~/components/GlobalError";
import ActivityFormSkeleton from "~/components/activity-reminder/loaders/ActivityFormSkeleton";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error("Activity Reminder ID is required");
  }

  const reminderPromise = fetchActivityReminder(params.id);

  return defer({
    reminderPromise,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const routineId = params.routineId;

  if (!routineId) {
    return json({ success: false, toast: "Routine ID is missing" });
  }

  const id = params.id;

  if (!id) {
    return json({ success: false, toast: "Activity Reminder ID is missing" });
  }

  const data = await request.formData();

  const _action = JSON.parse(data.get("_action") as string);

  if (_action === "update") {
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

    const response = await updateActivityReminder(id, {
      ...apiData,
      reminderListId: routineId,
    });

    return response;
  } else if (_action === "delete") {
    const response = await deleteActivityReminder(id);

    return response;
  }
}

const AddActivityReminder = () => {
  const [resolvedReminder, setResolvedReminder] =
    useState<EditActivityReminderType | null>(null);

  const form = useForm({
    validator: addActivityValidator,
    defaultValues: EditActivityReminderDefaultValues(resolvedReminder),
    handleSubmit: async (values) => {
      console.log({ values });
      submit(
        { _action: JSON.stringify("update"), values: JSON.stringify(values) },
        { method: "PUT" },
      );
    },
  });

  const { reminderPromise } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const navigate = useNavigate();

  const { routineId } = useParams();

  const isSubmitting = navigation.state === "submitting";

  const submit = useSubmit();

  useEffect(() => {
    if (reminderPromise) {
      reminderPromise.then((data) => {
        startTransition(() => {
          setResolvedReminder(data.data);
          form.resetForm(EditActivityReminderDefaultValues(data.data));
        });
      });
    }
  }, [reminderPromise]);

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 3000,
        isError: !actionData.success,
      });

      if (
        actionData.success &&
        actionData.toast === "Reminder deleted successfully"
      ) {
        navigate(`/app/routine/${routineId}`, {
          unstable_viewTransition: true,
        });
      }
    }
  }, [actionData]);

  return (
    <Page
      title="Customize Activity Reminder"
      backAction={{
        content: "Back",
        onAction: () => {
          navigate(`/app/routine/${routineId}`, {
            unstable_viewTransition: true,
          });
        },
      }}
      primaryAction={{
        content: "Delete",
        destructive: true,
        onAction: () => {
          submit({ _action: JSON.stringify("delete") }, { method: "delete" });
        },
        loading:
          isSubmitting && navigation.formData?.get("_action") === '"delete"',

        disabled: isSubmitting,
      }}
      secondaryActions={[
        {
          content: "Save",
          onAction: () => {
            form.submit();
          },
          loading:
            isSubmitting && navigation.formData?.get("_action") === '"update"',
          disabled: isSubmitting,
        },
      ]}
      narrowWidth
    >
      <Suspense fallback={<ActivityFormSkeleton />}>
        <Await resolve={reminderPromise} errorElement={<GlobalErrorCard />}>
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
        </Await>
      </Suspense>
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
      <Page title="Customize Activity Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Customize Activity Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
