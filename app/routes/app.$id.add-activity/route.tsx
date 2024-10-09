import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { FormEvent, useMemo, useRef, useState } from "react";
import AddTimeSlot from "~/components/edit-routine/activity-reminder/AddActivityTimeSlot";

import prisma from "../../db.server";
import { ValidatedForm } from "@rvf/remix";
import { addProductValidator } from "~/utils/validators";
import { ActivityReminderInitialSlots, AddActivityType } from "~/types";
import AddActivity from "~/components/edit-routine/activity-reminder/AddActivity";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  if (final.customDays) {
    final.customDays = JSON.parse(final.customDays as string);
  }

  const times = JSON.parse(final.times as string);

  try {
    const routine = await prisma.activityReminder.create({
      data: {
        activityName: final.activityName as string,
        activityType: final.activityType as string,
        goal: final.goal as string,
        goalUnit: final.goalUnit as string,
        daily: final.daily === "daily",
        times,
        customDays: final.customDays as any,
        durationQty: final.durationQty as string,
        durationUnit: final.durationUnit as string,
        routineId: params.id as string,
      },
    });
    return json({
      success: true,
      data: routine,
    });
  } catch (error) {
    console.log(final);
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

  const initialSlotsState: ActivityReminderInitialSlots = useMemo(() => {
    return {
      hours: "",
      minutes: "",
      timeUnit: "AM",
    };
  }, []);

  const [slots, setSlots] = useState([initialSlotsState]);

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
    formData.append("activityName", activity.activityName);

    const times = slots.map((slot) => {
      return `${slot.hours}:${slot.minutes} ${slot.timeUnit}`;
    });

    formData.append("times", JSON.stringify(times));

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
          <AddTimeSlot
            setCurrentStep={setCurrentStep}
            slots={slots}
            setSlots={setSlots}
            initialSlotsState={initialSlotsState}
          />
        )}

        <div
          style={{ marginTop: "10px", marginBottom: "30px", height: "100%" }}
        >
          <Button
            variant="primary"
            tone="critical"
            size="large"
            onClick={() => navigate("/app/routine-list")}
          >
            Cancel
          </Button>
        </div>
      </Page>
    </ValidatedForm>
  );
};

export default AddActivityReminder;
