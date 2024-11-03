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
  Grid,
  SkeletonThumbnail,
} from "@shopify/polaris";

const RoutineFormSkeleton = () => {
  return (
    <>
      <Layout>
        <Layout.Section>
          <FormLayout>
            <Card>
              <BlockStack gap="200">
                <Text as="h1">Routine Name</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h1">Category</Text>
                <SkeletonBodyText lines={2} />
                <Text as="h1">Description</Text>
                <SkeletonBodyText lines={5} />
              </BlockStack>
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
              <InlineStack align="center" blockAlign="center">
                <Box paddingBlock={"600"}>
                  <Spinner size="large" />
                </Box>
              </InlineStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <Text as="h1">Select Reminder Channels</Text>
                <SkeletonBodyText lines={4} />
              </BlockStack>
            </Card>
          </FormLayout>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <FormLayout>
            <Card>
              <BlockStack gap="200">
                <Text as="h1">Status</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text as="h1">Draft</Text>
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </FormLayout>
        </Layout.Section>
      </Layout>

      <div style={{ marginTop: "30px" }}></div>

      <Text as="h1" variant="headingLg">
        Reminders
      </Text>

      <div style={{ marginTop: "30px" }}></div>

      <Grid gap={{ lg: "20px" }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid.Cell
            columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
            key={index}
          >
            <Card>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80px", height: "80px" }}>
                  <SkeletonThumbnail size="large" />
                </div>

                <SkeletonBodyText lines={4} />
              </div>
            </Card>
          </Grid.Cell>
        ))}
      </Grid>
    </>
  );
};

export default RoutineFormSkeleton;
