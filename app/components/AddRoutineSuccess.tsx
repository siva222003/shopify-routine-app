import { Banner } from "@shopify/polaris";
import React from "react";

export default function BannerExample() {
  return (
    <Banner title="Order archived" onDismiss={() => {}}>
      <p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
    </Banner>
  );
}
