import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { FormEvent, useRef, useState } from "react";
import AddTimeSlot from "~/components/edit-routine/product-reminder/AddTimeSlot";

import prisma from "../db.server";
import { ValidatedForm } from "@rvf/remix";
import { addProductValidator } from "~/utils/validators";
import { AddActivityType, AddProductType } from "~/types";
import AddActivity from "~/components/edit-routine/activity-reminder/AddActivity";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  if (final.customDays) {
    final.customDays = JSON.parse(final.customDays as string);
  }

  const time = `${final.hours}:${final.minutes} ${final.unit}`;

  try {
    // const response = await prisma.reminder.create({
    //   data: {
    //     description: final.description as string,
    //     dosageQty: final.dosageQty as string,
    //     dosageUnit: final.dosageUnit as string,
    //     routineId: params.id as string,
    //     product: final.product as any,
    //     time,
    //     daily: final.daily === "daily",
    //     timeRange: final.timeRange as string,
    //   },
    // });

    return json({
      success: true,
      data: final,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

const AddActivityReminder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const activityInitialState: AddActivityType = {
    activityName: "",
    activityType: "",
    selectedDays: [],
    intakeFrequency: "daily",
    goal: "1",
    goalUnit: "",
  };

  const [activity, setActivity] = useState(activityInitialState);

  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  console.log(data);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);

    if (activity.selectedDays.length > 0) {
      formData.append("customDays", JSON.stringify(activity.selectedDays));
    }

    formData.append("goalUnit", activity.goalUnit);
    formData.append("goal", activity.goal);
    formData.append("activityType", activity.activityType);
    formData.append("daily", activity.intakeFrequency);

    submit(formData, { method: "post" });
  };

  return (
    <ValidatedForm
      method="post"
      validator={addProductValidator}
      onSubmit={handleSubmit}
    >
      <Page title="Add Activity Reminder " narrowWidth>
        {currentStep === 1 && (
          <AddActivity
            setCurrentStep={setCurrentStep}
            activity={activity}
            setActivity={setActivity}
          />
        )}
        {currentStep === 2 && (
          <AddTimeSlot setCurrentStep={setCurrentStep} isActivity={true} />
        )}

        <div
          style={{ marginTop: "10px", marginBottom: "30px", height: "100%" }}
        >
          <Button
            variant="primary"
            tone="critical"
            size="large"
            onClick={() => navigate("/app/routines")}
          >
            Cancel
          </Button>
        </div>
      </Page>
    </ValidatedForm>
  );
};

export default AddActivityReminder;
