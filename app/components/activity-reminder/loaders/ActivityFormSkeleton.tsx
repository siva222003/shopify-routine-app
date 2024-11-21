import {
  Card,
  SkeletonBodyText,
  BlockStack,
  Layout,
  FormLayout,
  Text,
  InlineStack,
  Spinner,
  Box,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";

const ActivityFormSkeleton = () => {
  return (
    <Layout>
      <Layout.Section>
        <FormLayout>
          <Card>
            <BlockStack gap="200">
              <Text as="h1">Activity Name</Text>
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200">
              <Text as="h1">Activity Type</Text>
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>

          <Card>
            <InlineStack align="center" blockAlign="center">
              <Box paddingBlock={"1600"}>
                <Spinner size="large" />
              </Box>
            </InlineStack>
          </Card>

          <Card>
            <FormLayout.Group>
              <BlockStack gap="200">
                <Text as="h1">Goal</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
              <BlockStack gap="200">
                <Text as="h1">Unit</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </FormLayout.Group>
          </Card>
          <Card>
            <FormLayout.Group>
              <BlockStack gap="200">
                <Text as="h1">Duration</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
              <BlockStack gap="200">
                <Text as="h1">Unit</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </FormLayout.Group>
          </Card>

          <Card>
            <Text as="h1">Time Slots</Text>
            <div style={{ marginTop: "10px" }}></div>

            <Box
              borderWidth="025"
              borderColor="border-disabled"
              borderStartStartRadius={"200"}
              padding="300"
            >
              <BlockStack gap="400">
                <FormLayout.Group condensed>
                  <BlockStack gap="200">
                    <Text as="h1">Hours</Text>
                    <SkeletonBodyText lines={2} />
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="h1">Minutes</Text>
                    <SkeletonBodyText lines={2} />
                  </BlockStack>
                  <BlockStack gap="200">
                    <Text as="h1">AM/PM</Text>
                    <SkeletonBodyText lines={2} />
                  </BlockStack>
                </FormLayout.Group>
              </BlockStack>
              <div
                style={{
                  marginTop: "13px",
                }}
              ></div>
              <InlineStack align="end">
                <Button
                  variant="secondary"
                  tone="critical"
                  disabled
                  onClick={() => {}}
                >
                  Delete
                </Button>
              </InlineStack>
            </Box>
            <Box
              padding="100"
              borderWidth="025"
              borderColor="border-disabled"
              borderEndStartRadius="200"
              borderEndEndRadius="200"
            >
              <ButtonGroup>
                <Button
                  disabled
                  icon={PlusCircleIcon}
                  onClick={() => {}}
                  variant="tertiary"
                >
                  Add Slot
                </Button>
              </ButtonGroup>
            </Box>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text as="h1">Select Frequency</Text>
              <SkeletonBodyText lines={7} />
            </BlockStack>
          </Card>
        </FormLayout>
      </Layout.Section>
    </Layout>
  );
};

export default ActivityFormSkeleton;
