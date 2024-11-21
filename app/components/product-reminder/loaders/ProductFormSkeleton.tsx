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
  RadioButton,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { PlusCircleIcon } from "@shopify/polaris-icons";

const ProductFormSkeleton = () => {
  return (
    <Layout>
      <Layout.Section>
        <FormLayout>
          <Card padding={"0"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "245px",
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner size="large" />
              </div>

              <div
                style={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  paddingBlock: "30px",
                  paddingInlineEnd: "20px",
                  justifyContent: "start",
                  height: "200px",
                }}
              >
                <SkeletonBodyText lines={3} />
              </div>
            </div>
          </Card>
          <Card>
            <BlockStack gap="200">
              <Text as="h1">Product Type</Text>
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>
          <Card>
            <FormLayout.Group>
              <BlockStack gap="200">
                <Text as="h1">Dosage Quantity</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
              <BlockStack gap="200">
                <Text as="h1">Dosage Unit</Text>
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
                <BlockStack gap="200">
                  <Text as="h1">Date Range</Text>
                  <SkeletonBodyText lines={2} />
                </BlockStack>
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
                <InlineStack gap="400">
                  <RadioButton
                    label="Before Meal"
                    value="beforeMeal"
                    checked={true}
                    onChange={() => {}}
                  />
                  <RadioButton
                    label="After Meal"
                    value="afterMeal"
                    checked={false}
                    onChange={() => {}}
                  />
                </InlineStack>
              </BlockStack>
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

export default ProductFormSkeleton;
