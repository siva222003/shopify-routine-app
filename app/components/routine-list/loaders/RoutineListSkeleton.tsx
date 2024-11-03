import {
  IndexTable,
  SkeletonBodyText,
  SkeletonThumbnail,
} from "@shopify/polaris";

const RoutineListSkeleton = () => {
  const skeletonRowMarkup = Array.from({ length: 10 }, (_, index) => (
    <IndexTable.Row id={index + ""} position={index} key={index}>
      <IndexTable.Cell className="w-[50px] h-[50px]">
        <SkeletonThumbnail size="small" />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <SkeletonBodyText lines={1} />
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return <>{skeletonRowMarkup}</>;
};

export default RoutineListSkeleton;
