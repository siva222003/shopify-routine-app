import { useNavigate, useNavigation } from "@remix-run/react";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  Text,
} from "@shopify/polaris";

function GlobalErrorCard() {
  const navigate = useNavigate();

  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  const handleReload = () => {
    navigate(window.location.pathname);
  };

  const handleGoHome = () => {
    navigate("/app");
  };

  return (
    <Card roundedAbove="sm">
      <BlockStack gap="500">
        <BlockStack gap="200">
          <Text as="h2" variant="headingSm">
            An Error Has Occurred
          </Text>
          <Text as="p" variant="bodyMd">
            We’re sorry, something went wrong. Please try reloading the page or
            go back to the home page.
          </Text>
        </BlockStack>
        <InlineStack align="end">
          <ButtonGroup>
            <Button
              loading={isLoading}
              onClick={handleReload}
              accessibilityLabel="Reload the page"
            >
              Reload Page
            </Button>
            <Button onClick={handleGoHome} variant="plain">
              Go to Home Page
            </Button>
          </ButtonGroup>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export default GlobalErrorCard;
