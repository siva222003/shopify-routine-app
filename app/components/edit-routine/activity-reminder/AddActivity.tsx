import { Form, useNavigate, useParams } from "@remix-run/react";
import {
  Card,
  FormLayout,
  RadioButton,
  TextField,
  BlockStack,
  OptionList,
  ButtonGroup,
  Button,
  Select,
} from "@shopify/polaris";
import { useCallback } from "react";
import { getError } from "~/utils/validated-from";
import { AddActivityType } from "~/types";

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  activity: AddActivityType;
  setActivity: React.Dispatch<React.SetStateAction<AddActivityType>>;
}

const AddActivity = ({ setCurrentStep, activity, setActivity }: Props) => {
  const handleChange = useCallback(
    (_: boolean, newValue: string) =>
      setActivity({ ...activity, intakeFrequency: newValue }),
    [],
  );

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <FormLayout>
        <FormLayout.Group condensed>
          <TextField
            autoComplete="off"
            name="activityName"
            label="Activity Name"
            type="text"
            value={activity.activityName}
            onChange={(value) =>
              setActivity({ ...activity, activityName: value })
            }
            // helpText={
            //   <span>
            //     We'll use this email address to inform you on future changes to
            //     Polaris.
            //   </span>
            // }
            // error={form.error("routineName") || undefined}
          />

          <Select
            label="Activity Type"
            placeholder="Select"
            name="activityType"
            options={["Physical", "Mental"]}
            value={activity.activityType}
            onChange={(value) =>
              setActivity({ ...activity, activityType: value })
            }
          />
        </FormLayout.Group>

        <FormLayout.Group condensed>
          <TextField
            label="Goal"
            name="goal"
            type="number"
            min={1}
            value={activity.goal}
            onChange={(value) => setActivity({ ...activity, goal: value })}
            autoComplete="off"
          />
          <Select
            label="Unit"
            placeholder="Select"
            name="goalUnit"
            options={["puff", "inhale"]}
            value={activity.goalUnit}
            onChange={(value) => setActivity({ ...activity, goalUnit: value })}
          />
        </FormLayout.Group>

        <BlockStack>
          <RadioButton
            label="Daily"
            helpText="Users have to take this routine every day."
            checked={activity.intakeFrequency === "daily"}
            id="daily"
            name="daily"
            onChange={handleChange}
          />
          <RadioButton
            label="Custom days"
            helpText="Users can select the days they want to take this routine."
            id="custom"
            name="daily"
            checked={activity.intakeFrequency === "custom"}
            onChange={handleChange}
          />
        </BlockStack>

        {activity.intakeFrequency === "custom" && (
          <Card>
            <OptionList
              title="Select days"
              onChange={(selected) =>
                setActivity({ ...activity, selectedDays: selected })
              }
              allowMultiple
              options={[
                { value: "Monday", label: "Monday" },
                { value: "Tuesday", label: "Tuesday" },
                { value: "Wednesday", label: "Wednesday" },
                { value: "Thursday", label: "Thursday" },
                { value: "Friday", label: "Friday" },
                { value: "Saturday", label: "Saturday" },
                { value: "Sunday", label: "Sunday" },
              ]}
              selected={activity.selectedDays}
            />
          </Card>
        )}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <ButtonGroup>
            <Button
              onClick={() => navigate(`/app/${id}/reminder`)}
              size="large"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              variant="primary"
              size="large"
              submit={true}
            >
              Save & Next
            </Button>
          </ButtonGroup>
        </div>
      </FormLayout>
    </>
  );
};

export default AddActivity;
