import { FormApi } from "@rvf/remix";
import {
  BlockStack,
  Button,
  Text,
  Card,
  TextField,
  InlineStack,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { useMemo } from "react";
import { WeeklyBenefitsType } from "~/routes/app.$id.weekly-benfits/validator";

interface WeeklyBenefitsInputProps {
  form: FormApi<WeeklyBenefitsType>;
}

const WeeklyBenefitsInput = ({ form }: WeeklyBenefitsInputProps) => {
  const handleAddBenefit = (index: number) => {
    const weeklyBenefits = form.value("weeklyBenefits") || [];
    const benefits = weeklyBenefits[index].benefits || [];
    const updatedBenefits = [...benefits, ""]; // Add a new empty benefit
    form.setValue(`weeklyBenefits[${index}].benefits`, updatedBenefits);
  };

  const handleRemoveBenefit = (index: number, subIndex: number) => {
    const weeklyBenefits = form.value("weeklyBenefits") || [];
    const benefits = weeklyBenefits[index].benefits || [];
    const updatedBenefits = benefits.filter((_, i) => i !== subIndex); // Remove the selected benefit
    form.setValue(`weeklyBenefits[${index}].benefits`, updatedBenefits);
  };

  const handleBenefitChange = (
    index: number,
    subIndex: number,
    value: string,
  ) => {
    const weeklyBenefits = form.value("weeklyBenefits") || [];
    const benefits = weeklyBenefits[index].benefits || [];
    const updatedBenefits = [...benefits];
    updatedBenefits[subIndex] = value; // Update the specific benefit
    form.setValue(`weeklyBenefits[${index}].benefits`, updatedBenefits);
  };

  return (
    <>
      <BlockStack gap="400">
        {(form.value("weeklyBenefits") || []).map((weeklyBenefit, index) => (
          <BlockStack key={index} gap="300">
            <Text as="h2" variant="headingSm">
              {`${weeklyBenefit.weekRange} week `}
            </Text>
            <Card>
              <BlockStack gap="500">
                {(weeklyBenefit.benefits || []).map((benefit, subIndex) => (
                  <BlockStack gap="300" key={subIndex}>
                    <TextField
                      name={`weeklyBenefits[${index}].benefits[${subIndex}]`}
                      autoComplete="off"
                      label="Benefit"
                      type="text"
                      multiline={4}
                      disabled={!form.value("totalWeeks")}
                      placeholder="Benefit: This routine will help you to..."
                      value={benefit}
                      error={
                        form.error(
                          `weeklyBenefits[${index}].benefits[${subIndex}]`,
                        ) || undefined
                      }
                      onChange={(value) =>
                        handleBenefitChange(index, subIndex, value)
                      }
                    />
                    <InlineStack align="end">
                      <Button
                        disabled={
                          !form.value("totalWeeks") ||
                          weeklyBenefit.benefits.length === 1
                        }
                        tone="critical"
                        variant="secondary"
                        onClick={() => handleRemoveBenefit(index, subIndex)}
                      >
                        Delete
                      </Button>
                    </InlineStack>
                  </BlockStack>
                ))}
                <Button
                  disabled={!form.value("totalWeeks")}
                  onClick={() => handleAddBenefit(index)}
                  accessibilityLabel="Add benefit"
                  icon={PlusIcon}
                >
                  Add Benefit
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        ))}
      </BlockStack>

      {form.value("weeklyBenefits").map((weeklyBenefit, index) => (
        <input
          key={index}
          type="text"
          hidden
          value={weeklyBenefit.weekRange}
          onChange={() => {}}
          name={`weeklyBenefits[${index}].weekRange`}
        />
      ))}
    </>
  );
};

export default WeeklyBenefitsInput;
