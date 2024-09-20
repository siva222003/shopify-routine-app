import { MediaCard } from "@shopify/polaris";
import React from "react";
import { AddProductType } from "~/types";

interface Props {
  setProduct: React.Dispatch<React.SetStateAction<AddProductType>>;
  product: AddProductType;
}

export default function ProductCard({ setProduct, product }: Props) {
  return (
    <MediaCard
      title={product.selectedProduct.title}
      description={product.selectedProduct.descriptionHtml}
      popoverActions={[
        {
          content: "Dismiss",
          onAction: () => setProduct({ ...product, selectedProduct: null }),
        },
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
        src={product.selectedProduct?.images[0].originalSrc}
      />
    </MediaCard>
  );
}
