import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData, useNavigate } from "@remix-run/react";
import { Button, Page, PageActions } from "@shopify/polaris";
import React, { useState } from "react";
import AddMeals from "~/components/edit-routine/AddMeals";
import AddProduct from "~/components/edit-routine/AddProduct";

export async function action({ request }: ActionFunctionArgs) {
  return json({ message: "Hello" });
}

const Testing = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  return (
    <Page title="Add Reminder Items" narrowWidth>
      {currentStep === 1 && <AddProduct setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && <AddMeals setCurrentStep={setCurrentStep} />}

      <div style={{ marginTop: "10px", marginBottom: "30px", height: "100%" }}>
        <Button
          variant="primary"
          tone="critical"
          size="large"
          onClick={() => navigate("/app/routine-list")}
        >
          Cancel
        </Button>
      </div>
    </Page>
  );
};

export default Testing;
