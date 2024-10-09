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
  Page,
  Text,
} from "@shopify/polaris";
import { useCallback } from "react";
import { getError } from "~/utils/validated-from";
import { PlusIcon } from "@shopify/polaris-icons";

interface Props {}

const WeeklyBenfits = ({}: Props) => {
  const handleChange = useCallback(
    (_: boolean, newValue: string) =>
      setActivity({ ...activity, intakeFrequency: newValue }),
    [],
  );

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <Page title="Add Weekly Benfits" narrowWidth>
        <Form method="post">
          <FormLayout>
            {/* <Text as="h2" variant="headingSm">
              Enter the weekly benefits.
            </Text> */}

            <FormLayout.Group condensed>
              <Select
                label="Select Weeks Intervals"
                placeholder="Select"
                name="weekIntervals"
                options={["physical", "mental"]}
                // value={activity.activityType}
                // onChange={(value) =>
                //   setActivity({ ...activity, activityType: value })
                // }
              />
            </FormLayout.Group>

            <Text as="h2" variant="headingSm">
              0-2 weeks
            </Text>

            <Card>
              <BlockStack gap="500">
                <TextField
                  autoComplete="off"
                  name="routineName"
                  label="Routine Name"
                  type="text"
                  // value={form.value("routineName") || ""}
                  // onChange={(e) => form.setValue("routineName", e)}
                  // helpText={
                  //   <span>
                  //     We'll use this email address to inform you on future changes
                  //     to Polaris.
                  //   </span>
                  // }
                  // error={form.error("routineName") || undefined}
                />
                <Button
                  onClick={() => navigate(`/app/routine/${id}`)}
                  accessibilityLabel="Add variant"
                  icon={PlusIcon}
                >
                  Add
                </Button>
              </BlockStack>
            </Card>

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
                  onClick={() => navigate(`/app/routine/${id}`)}
                  size="large"
                >
                  Back
                </Button>
                <Button
                  //   onClick={() => setCurrentStep(2)}
                  variant="primary"
                  size="large"
                  submit={true}
                >
                  Submit
                </Button>
              </ButtonGroup>
            </div>
          </FormLayout>
        </Form>
      </Page>
    </>
  );
};

export default WeeklyBenfits;
