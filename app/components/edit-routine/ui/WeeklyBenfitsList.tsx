import {
  Button,
  ButtonGroup,
  Card,
  DescriptionList,
  Divider,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { WeeklyBenefitsType } from "~/routes/app.$id.weekly-benfits/validator";
import React from "react";
import {
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "@remix-run/react";

interface WeeklyBenfitsListProps {
  benfits: WeeklyBenefitsType & { _id: string };
}

export default function WeeklyBenfitsGrid({ benfits }: WeeklyBenfitsListProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" &&
    JSON.stringify(benfits._id) === navigation.formData?.get("id");

  return (
    <Card>
      {benfits.weeklyBenefits.map((benefit, index) => (
        <React.Fragment key={index}>
          {index !== 0 && (
            <React.Fragment>
              <Divider />

              <div
                style={{
                  marginBlock: "20px",
                }}
              ></div>
            </React.Fragment>
          )}

          <h1
            style={{
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Week {benefit.weekRange}
          </h1>

          <DescriptionList
            items={benefit.benefits.map((benefit) => ({
              term: benefit.split(":")[0],
              description: benefit.split(":")[1],
            }))}
          />
        </React.Fragment>
      ))}

      <div
        style={{
          marginBlock: "30px",
        }}
      ></div>

      <InlineStack align="end">
        <ButtonGroup>
          <Button
            loading={isSubmitting}
            variant="secondary"
            tone="critical"
            onClick={() => {
              submit(
                {
                  _action: JSON.stringify("weeklyBenefitsDelete"),
                  id: JSON.stringify(benfits._id),
                },
                { method: "delete" },
              );
            }}
            accessibilityLabel="Cancel shipment"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/app/${id}/benfits/${benfits._id}`,{
              viewTransition : true,
            })}
            accessibilityLabel="Add tracking number"
          >
            Customize
          </Button>
        </ButtonGroup>
      </InlineStack>
    </Card>
  );
}
