import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import React from "react";
import { authenticate } from "~/shopify.server";

import prisma from "../db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const weeklyBenefits = await prisma.weeklyBenfits.create({
    data: {
      benefits: [
        {
          weekRange: "0 - 1",
          benefits: [
            "Improved Hydration: Your body will be better hydrated, leading to increased energy levels.",
            "Better Sleep: You may experience more restful sleep during this period.",
          ],
        },
        {
          weekRange: "1 - 2",
          benefits: [
            "Enhanced Skin Glow: You will notice an improved glow in your skin.",
            "Increased Mental Clarity: Your focus and mental sharpness will improve.",
          ],
        },
        {
          weekRange: "2 - 3",
          benefits: [
            "Stronger Immune System: Your immune response will be enhanced.",
            "Weight Management: You may observe a slight improvement in weight management.",
          ],
        },
      ],
      routineId: "66ed50d51d496c902af16ad1", // Replace this with your actual routine ID
    },
  });

  return json({ success: true, weeklyBenefits });
}

// const Api = () => {
//   return <Outlet />;
// };

// export default Api;
