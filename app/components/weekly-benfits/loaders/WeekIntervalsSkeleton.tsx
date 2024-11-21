import {
  BlockStack,
  Card,
  SkeletonBodyText,
  TextField,
} from "@shopify/polaris";

const WeekIntervalsSkeleton = () => {
  return (
    <Card>
      <BlockStack gap="200">
        <TextField
          autoComplete="off"
          name="benfits"
          label="Select Week Intervals"
          type="text"
          placeholder="Benfit: This routine will help you to..."
          disabled={true}
          loading={true}
        />
        <SkeletonBodyText lines={1} />
      </BlockStack>
    </Card>
  );
};

export default WeekIntervalsSkeleton;
