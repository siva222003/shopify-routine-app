import React from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { useNavigate, useParams } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";

export default function ChooseReminder() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Page>
      <TitleBar title="Select Reminder" />
      <Box>
        <InlineStack align="center">
          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingSm">
                  Product Based
                </Text>
                <Button
                  onClick={() => navigate(`/app/${id}/add-product`)}
                  accessibilityLabel="Add variant"
                  icon={PlusIcon}
                >
                  Add Product
                </Button>
              </InlineGrid>
              <Text as="p" variant="bodyMd">
                Skincare products, medication and other essentials.
              </Text>
            </BlockStack>
          </Card>

          <div style={{ marginLeft: "20px", marginRight: "20px" }}></div>

          <Card roundedAbove="sm">
            <BlockStack gap="200">
              <InlineGrid columns="1fr auto">
                <Text as="h2" variant="headingSm">
                  Activity Based
                </Text>
                <Button
                  onClick={() => navigate(`/app/${id}/add-activity`)}
                  accessibilityLabel="Add variant"
                  icon={PlusIcon}
                >
                  Add Activity
                </Button>
              </InlineGrid>
              <Text as="p" variant="bodyMd">
                Yoga sessions, running, gym workouts, and reading books.
              </Text>
            </BlockStack>
          </Card>
        </InlineStack>
      </Box>
    </Page>
  );
}
