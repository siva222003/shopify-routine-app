import { MediaCard } from "@shopify/polaris";
import React from "react";

interface Props {
  setSelectedProduct: React.Dispatch<React.SetStateAction<any>>;
  selectedProduct: any;
}

export default function ProductCard({
  setSelectedProduct,
  selectedProduct,
}: Props) {
  return (
    <MediaCard
      title={selectedProduct.title}
      description={selectedProduct.descriptionHtml}
      popoverActions={[
        { content: "Dismiss", onAction: () => setSelectedProduct(null) },
      ]}
      size="small"
    >
      <img
        alt=""
        height="140"
        width="100%px"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          margin: "none",
        }}
        src={selectedProduct?.images[0].originalSrc}
      />
    </MediaCard>
  );
}
