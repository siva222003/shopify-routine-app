import { useState, useEffect } from "react";
import { FormApi } from "@rvf/remix";
import { MediaCard, Spinner } from "@shopify/polaris";
import { ProductReminderType } from "~/routes/app.$id.add-product/validator";

interface Props {
  form: FormApi<ProductReminderType>;
  fetchProducts: () => Promise<void>;
}

export default function ProductCard({ form, fetchProducts }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = form.value("image");

  const handleRemoveProduct = () => {
    form.setValue("name", "");
    form.setValue("image", "");
    form.setValue("productId", "");
    form.setValue("variationId", "");
    setImageLoaded(false); // Reset loading state when the product is removed
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Reset imageLoaded state whenever the image source changes
  useEffect(() => {
    if (imageSrc) {
      setImageLoaded(false); // Show spinner while the new image loads
    }
  }, [imageSrc]);

  return (
    <MediaCard
      title={form.value("name")}
      primaryAction={{
        content: "Change Product",
        onAction: fetchProducts,
      }}
      secondaryAction={{
        content: "Delete",
        destructive: true,
        onAction: handleRemoveProduct,
      }}
      description={`Variant ID: ${form.value("variationId")}`}
    >
      {!imageLoaded && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Spinner accessibilityLabel="Loading image" size="large" />
        </div>
      )}

      <img
        alt=""
        style={{
          objectFit: "cover",
          objectPosition: "center",
          display: imageLoaded ? "block" : "none",
          width: "100%",
          height: "200px",
          borderRadius: "8px",
        }}
        src={imageSrc}
        onLoad={handleImageLoad}
      />
    </MediaCard>
  );
}
