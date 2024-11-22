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
  List,
} from "@shopify/polaris";
import GlobalErrorCard from "~/components/GlobalError";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Page
      title="Minga Routines : Your Personal Wellness & Habit Companion"
      primaryAction={{
        content: "Create Routine",
        onAction: () =>
          navigate("/app/add-routine", {
            unstable_viewTransition: true,
          }),
      }}
    >
      <Layout>
        {/* Welcome Section */}
        <Layout.Section>
          <Card>
            <Text as="h1" variant="headingMd">
              Welcome to Minga Routines
            </Text>

            <div style={{ margin: "15px 0" }}></div>

            <BlockStack gap={"100"}>
              <p>
                Minga Routines is a wellness and habit companion that helps
                users build and maintain healthy routines. With pre-made
                routines and reminders, users can easily incorporate wellness
                activities into their daily lives.
              </p>
              <p>
                This App makes it easy for users to kickstart healthier habits
                with pre-made routines tailored to their needs. From skincare to
                fitness, each routine can be imported and customized with ease.
              </p>
            </BlockStack>

            <div style={{ margin: "20px 0" }}></div>

            <Divider />

            <div style={{ margin: "20px 0" }}></div>

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
                  <strong>Weekly Benefits:</strong> Add a weekly benefit to your
                  routine.
                </li>
              </ul>
              <p>
                Empower your users to build consistent wellness routines and
                reach their goals with Routine.
              </p>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Instructions Section */}
        <Layout.Section>
          <Card>
            <Text as="h1" variant="headingMd">
              Instructions for Setting Up App Blocks in the Theme Editor
            </Text>
            <div style={{ margin: "15px 0" }}></div>
            <BlockStack gap={"050"}>
              <List gap="loose" type="number">
                <List.Item>
                  <strong>Access the Theme Editor</strong>
                  <p>
                    In Shopify Admin, navigate to <strong>Online Store</strong>{" "}
                    &gt; <strong>Themes</strong> &gt; <strong>Customize</strong>{" "}
                    and select the published theme.
                  </p>
                </List.Item>
                <List.Item>
                  <strong>Create Custom Page Templates</strong>
                  <p>
                    Go to <strong>Pages</strong> &gt;{" "}
                    <strong>Create Template</strong> and create the following
                    templates:
                  </p>
                  <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                    <li>routine-list</li>
                    <li>routine</li>
                    <li>user-routine-list</li>
                    <li>user-routine</li>
                  </ul>
                </List.Item>
                <List.Item>
                  <strong>Assign Templates to Pages</strong>
                  <p>To assign templates to pages:</p>
                  <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
                    <li>
                      Navigate to <strong>Shopify Admin</strong> &gt;{" "}
                      <strong>Online Store</strong> &gt; <strong>Pages</strong>.
                    </li>
                    <li>Select the page you want to assign a template to.</li>
                    <li>
                      In the <strong>Theme template</strong> drop-down menu,
                      choose the relevant template:
                      <ul
                        style={{ listStyleType: "square", paddingLeft: "20px" }}
                      >
                        <li>routine-list → Routine List</li>
                        <li>routine → Routine</li>
                        <li>user-routine-list → User Routine List</li>
                        <li>user-routine → User Routine</li>
                      </ul>
                    </li>
                    <li>Save changes.</li>
                  </ul>
                </List.Item>
                <List.Item>
                  <strong>Duplicate the Published Theme</strong>
                  <p>
                    Go to <strong>Online Store</strong> &gt;{" "}
                    <strong>Themes</strong> and click <strong>Duplicate</strong>{" "}
                    on the published theme to create a backup.
                  </p>
                </List.Item>
                <List.Item>
                  <strong>Customize the Duplicate Theme</strong>
                  <p>
                    Select the duplicated theme and click{" "}
                    <strong>Customize</strong>.
                  </p>
                </List.Item>
                <List.Item>
                  <strong>Hide Default Page Sections</strong>
                  <p>
                    In the Theme Editor:
                    <ul
                      style={{ listStyleType: "circle", paddingLeft: "20px" }}
                    >
                      <li>
                        Select the Page template for each of the four pages.
                      </li>
                      <li>
                        Hide the default "Page" section in the side panel.
                      </li>
                      <li>
                        Click <strong>Add Section</strong> and select the
                        corresponding app block for each page:
                        <ul
                          style={{
                            listStyleType: "square",
                            paddingLeft: "20px",
                          }}
                        >
                          <li>routine-list → Routine List</li>
                          <li>routine → Routine</li>
                          <li>user-routine-list → User Routine List</li>
                          <li>user-routine → User Routine</li>
                        </ul>
                      </li>
                    </ul>
                  </p>
                </List.Item>
                <List.Item>
                  <strong>Disable Section Margins</strong>
                  <p>
                    For each app block, navigate to the Apps section in the side
                    panel and turn off the "Make section margins the same as
                    theme".
                  </p>
                </List.Item>
                <List.Item>
                  <strong>Save, Test, and Publish</strong>
                  <p>
                    Save your changes, test the functionality, and publish the
                    updated theme.
                  </p>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <div style={{ margin: "35px 0" }}></div>
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
