import {
  BlockStack,
  Button,
  Card,
  FormLayout,
  InlineStack,
  Layout,
  SkeletonBodyText,
  Text,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

const WeeklyBenefitsSkeleton = () => {
  return (
    <Layout>
      <Layout.Section>
        <FormLayout>
          <Card>
            <BlockStack gap="200">
              <Text as="h1">Select Week Intervals</Text>
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>

          {[1, 2].map((_, index) => (
            <BlockStack key={index} gap="400">
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm">
                  {`${index} - ${index + 1} week`}
                </Text>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h1">Benefit</Text>
                    <SkeletonBodyText lines={3} />
                  </BlockStack>

                  <BlockStack gap="500">
                    <BlockStack gap="300">
                      <InlineStack align="end">
                        <Button
                          disabled={true}
                          tone="critical"
                          variant="secondary"
                          onClick={() => {}}
                        >
                          Delete
                        </Button>
                      </InlineStack>
                    </BlockStack>

                    <Button
                      disabled={true}
                      onClick={() => {}}
                      accessibilityLabel="Add benefit"
                      icon={PlusIcon}
                    >
                      Add Benefit
                    </Button>
                  </BlockStack>
                </Card>
              </BlockStack>
            </BlockStack>
          ))}
        </FormLayout>
      </Layout.Section>
    </Layout>
  );
};

export default WeeklyBenefitsSkeleton;
