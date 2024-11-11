import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  BlockStack,
  Text,
  Divider,
} from "@shopify/polaris";
import React from "react";
import GlobalErrorCard from "~/components/GlobalError";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="Routine : Your Personal Wellness & Habit Companion"
      primaryAction={{
        content: "Create Routine",
        onAction: () => navigate("/app/add-routine"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h1" variant="headingMd">
              Welcome to Routine
            </Text>

            <div
              style={{
                margin: "15px 0",
              }}
            ></div>

            <BlockStack gap={"100"}>
              <p>
                Routine is a wellness and habit companion that helps users build
                and maintain healthy routines. With pre-made routines and
                reminders, users can easily incorporate wellness activities into
                their daily lives.
              </p>

              {/* <BlockStack> */}
              <p>
                Routine App makes it easy for users to kickstart healthier
                habits with pre-made routines tailored to their needs. From
                skincare to fitness, each routine can be imported and customized
                with ease.
              </p>
            </BlockStack>

            <div
              style={{
                margin: "20px 0",
              }}
            ></div>

            <Divider />

            <div
              style={{
                margin: "20px 0",
              }}
            ></div>

            <Text variant="headingMd" as="h1">
              Features
            </Text>

            <BlockStack gap={"300"}>
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <strong>Pre-Made Routines:</strong> Select from routines
                  designed for various wellness goals.
                </li>
                <li>
                  <strong>Activity & Product-Based Reminders:</strong> Receive
                  daily prompts for exercises, self-care, and product
                  applications.
                </li>
                <li>
                  <strong>Multi-Channel Notifications:</strong> Stay on track
                  with reminders via SMS, WhatsApp, and email.
                </li>
                <li>
                  <strong>Weekly Benefits</strong> Add a weekly benefit to your
                  routine.
                </li>
              </ul>
              <p>
                Empower your users to build consistent wellness routines and
                reach their goals with the Routine.
              </p>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Page title="Routine : Your Personal Wellness & Habit Companion">
        <GlobalErrorCard />
      </Page>
    );
  } else if (error instanceof Error) {
    return (
      <Page title="Routine : Your Personal Wellness & Habit Companion">
        <GlobalErrorCard />
      </Page>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
