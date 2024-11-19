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
import { addProductValidator } from "~/routes/app.$id.add-product/validator";
import {
  AddProduct,
  AddProductTimeSlot,
  DosageInput,
  DurationInput,
  Frequency,
  ProductTypeInput,
} from "~/components/product-reminder";
import {
  formattedAppBasedTimeslots,
  formattedConsumableTimeslots,
} from "~/routes/app.$id.add-product/helper";
import { fetchProductReminder, updateProductReminder } from "./api";
import { EditProductReminderDefaultValues } from "./helper";
import { EditProductReminderType } from "./types";
import { deleteProductReminder } from "../app.routine.$id/api";
import GlobalErrorCard from "~/components/GlobalError";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error("Product Reminder ID is required");
  }

  const reminderPromise = fetchProductReminder(params.id);

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
    return json({ success: false, toast: "Product Reminder ID is missing" });
  }

  const data = await request.formData();

  const _action = JSON.parse(data.get("_action") as string);

  if (_action === "update") {
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

    const response = await updateProductReminder(id, {
      ...apiData,
      reminderListId: routineId,
    });

    return response;
  } else if (_action === "delete") {
    const response = await deleteProductReminder(id);

    return response;
  }
}

const EditProductReminder = () => {
  const [resolvedReminder, setResolvedReminder] =
    useState<EditProductReminderType | null>(null);

  const form = useForm({
    validator: addProductValidator,
    defaultValues: EditProductReminderDefaultValues(resolvedReminder),
    handleSubmit: async (values) => {
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
          console.log({ data: data.data });
          setResolvedReminder(data.data);
          form.resetForm(EditProductReminderDefaultValues(data.data));
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
        navigate(`/app/routine/${routineId}`,{
          unstable_viewTransition: true,
        });
      }
    }
  }, [actionData]);

  return (
    <Page
      title="Customize Product Reminder"
      backAction={{
        content: "Back",
        onAction: () => navigate(`/app/routine/${routineId}`,{
          unstable_viewTransition: true,
        }),
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
      <Suspense fallback="Loading...">
        <Await resolve={reminderPromise} errorElement={<GlobalErrorCard />}>
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

export default EditProductReminder;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Customize Product Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Customize Product Reminder">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
