import { Spinner as PolarisSpinner } from "@shopify/polaris";

export default function GlobalSpinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <PolarisSpinner accessibilityLabel="Loading" size="large" />
    </div>
  );
}
