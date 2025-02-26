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
import { Suspense, useEffect } from "react";
import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import { addWeeklyBenefits, fetchRoutineForDuration } from "./api";
import WeekIntervalsInput from "~/components/weekly-benfits/WeekIntervalsInput";
import WeekIntervalsSkeleton from "~/components/weekly-benfits/loaders/WeekIntervalsSkeleton";
import { EditRoutineResponseType } from "../app.routine.$id/types";
import { useForm } from "@rvf/remix";
import { benfitsValidator } from "./validator";
import { WeeklyBenfitsDefaultValues } from "./helper";
import WeeklyBenefitsInput from "~/components/weekly-benfits/WeeklyBenefitsInput";
import { TitleBar } from "@shopify/app-bridge-react";
import GlobalErrorCard from "~/components/GlobalError";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error("Routine ID is required");
  }

  const response = fetchRoutineForDuration(params.id);

  return defer({ routinePromise: response });
}

export async function action({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    return json({ success: false, toast: "Routine ID is required" });
  }

  const data = await request.formData();

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

  const response = await addWeeklyBenefits({
    ...apiData,
    reminderListId: params.id,
  });

  return response;
}

const WeeklyBenfits = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const { routinePromise } = useLoaderData<typeof loader>();

  const form = useForm({
    validator: benfitsValidator,
    defaultValues: WeeklyBenfitsDefaultValues,
    handleSubmit: (values) => {
      console.log({ values });
      submit({ values: JSON.stringify(values) }, { method: "POST" });
    },
  });

  console.log(form.formState.fieldErrors);

  useEffect(() => {
    if (actionData) {
      shopify.toast.show(actionData.toast, {
        duration: 3000,
        isError: !actionData.success,
      });
    }
  }, [actionData]);

  return (
    <Form {...form.getFormProps()}>
      <Page
        title="Add Weekly Benefits"
        narrowWidth
        backAction={{
          content: "Back",
          onAction: () => navigate(`/app/routine/${id}`,{
            viewTransition: true,
          }),
        }}
        primaryAction={{
          type: "submit",
          onAction: form.submit,
          disabled: isSubmitting,
          loading: isSubmitting,
          content: "Save",
        }}
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
        <div
          style={{
            marginTop: "3rem",
          }}
        ></div>
      </Page>
    </Form>
  );
};

export default WeeklyBenfits;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Add Weekly Benefits">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Customize Weekly Benefits">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
