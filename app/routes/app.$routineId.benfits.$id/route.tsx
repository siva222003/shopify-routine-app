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
import { Suspense, useEffect, useState } from "react";
import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  addWeeklyBenefits,
  fetchRoutineForDuration,
} from "~/routes/app.$id.weekly-benfits/api";
import WeekIntervalsInput from "~/components/weekly-benfits/WeekIntervalsInput";
import WeekIntervalsSkeleton from "~/components/weekly-benfits/loaders/WeekIntervalsSkeleton";
import { EditRoutineResponseType } from "../app.routine.$id/types";
import { useForm } from "@rvf/remix";
import {
  benfitsValidator,
  WeeklyBenefitsType,
} from "~/routes/app.$id.weekly-benfits/validator";
import { WeeklyBenfitsDefaultValues } from "~/routes/app.$id.weekly-benfits/helper";
import WeeklyBenefitsInput from "~/components/weekly-benfits/WeeklyBenefitsInput";
import { TitleBar } from "@shopify/app-bridge-react";
import { deleteBenefits, fetchBenfits, updateBenefits } from "./api";
import { EditActivityReminderDefaultValues } from "../app.$routineId.activity.$id/helper";
import { EditWeeklyBenefitsDefaultValues } from "./helper";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.routineId) {
    throw new Error("Routine ID is required");
  }

  if (!params.id) {
    throw new Error("Benfits ID is required");
  }

  const routineResponse = fetchRoutineForDuration(params.routineId);
  const benfitsResponse = fetchBenfits(params.id);

  return defer({
    routinePromise: routineResponse,
    benfitsPromise: benfitsResponse,
  });
}

export async function action({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    return json({ success: false, toast: "Routine ID is required" });
  }

  const data = await request.formData();

  const _action = JSON.parse(data.get("_action") as string);

  if (_action === "delete") {
    const response = await deleteBenefits(params.id);

    return response;
  } else if (_action === "update") {
    const values = JSON.parse(data.get("values") as string);

    const result = await benfitsValidator.validate(values);

    if (result.error) {
      return json({
        success: false,
        toast: "Invalid Fields",
      });
    }

    const apiData = result.data;

    (apiData as any).totalWeeks = parseInt(apiData.totalWeeks);

    console.log({
      ...apiData,
      reminderListId: params.id,
    });

    const response = await updateBenefits(params.id, apiData);

    return response;
  }
}

const EditWeeklyBenfits = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const { routinePromise, benfitsPromise } = useLoaderData<typeof loader>();

  const [resolvedBenfits, setResolvedBenfits] = useState<
    (WeeklyBenefitsType & { _id: string }) | null
  >(null);

  useEffect(() => {
    if (benfitsPromise) {
      benfitsPromise.then((data) => {
        setResolvedBenfits(data.data);
        form.resetForm(EditWeeklyBenefitsDefaultValues(data.data));
      });
    }
  }, [benfitsPromise]);

  const form = useForm({
    validator: benfitsValidator,
    defaultValues: EditWeeklyBenefitsDefaultValues(resolvedBenfits),
    handleSubmit: (values) => {
      console.log({ values });
      submit(
        { _action: JSON.stringify("update"), values: JSON.stringify(values) },
        { method: "PUT" },
      );
    },
  });

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 3000,
        isError: !actionData.success,
      });
      if (
        actionData.success &&
        actionData.toast === "Benefits deleted successfully"
      ) {
        navigate(`/app/routine/${routineId}`);
        return;
      }
    }
  }, [actionData]);

  return (
    <Form {...form.getFormProps()}>
      <Page
        title="Add Weekly Benfits"
        narrowWidth
        backAction={{
          content: "Back",
          onAction: () => navigate(`/app/routine/${routineId}`),
        }}
        primaryAction={{
          content: "Delete",
          loading:
            isSubmitting && navigation.formData?.get("_action") === '"delete"',
          disabled: isSubmitting,
          onAction: () => {
            submit({ _action: JSON.stringify("delete") }, { method: "DELETE" });
          },
          type: "destructive",
        }}
        secondaryActions={[
          {
            content: "Save",
            onAction: () => {
              form.submit();
            },
            loading:
              isSubmitting &&
              navigation.formData?.get("_action") === '"update"',
            disabled: isSubmitting,
          },
        ]}
      >
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={benfitsPromise}
            errorElement={<p>Some Error Occured</p>}
          >
            <FormLayout>
              <Suspense fallback={<WeekIntervalsSkeleton />}>
                <Await
                  resolve={routinePromise as Promise<EditRoutineResponseType>}
                  errorElement={
                    <p>Some Error Occured while retrieving week intervals</p>
                  }
                >
                  <WeekIntervalsInput form={form} />
                </Await>
              </Suspense>

              <WeeklyBenefitsInput form={form} />
            </FormLayout>
          </Await>
        </Suspense>
      </Page>
    </Form>
  );
};

export default EditWeeklyBenfits;

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
