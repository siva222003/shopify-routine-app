import { Page } from "@shopify/polaris";
import React from "react";

const Home = () => {
  return (
    <Page title="Home">
      <img
        width="100%"
        height={500}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: "40px",
        }}
        src="https://cdn.shopify.com/s/files/1/0913/1075/2035/files/Banner_Image.png?v=1731169440"
        alt=""
      />
    </Page>
  );
};

export default Home;
