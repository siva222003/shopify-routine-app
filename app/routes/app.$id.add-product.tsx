import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { FormEvent, useRef, useState } from "react";
import AddTimeSlot from "~/components/edit-routine/product-reminder/AddTimeSlot";
import AddProduct from "~/components/edit-routine/product-reminder/AddProduct";

import prisma from "../db.server";
import { ValidatedForm } from "@rvf/remix";
import { addProductValidator } from "~/utils/validators";
import { AddProductType } from "~/types";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  if (final.customDays) {
    final.customDays = JSON.parse(final.customDays as string);
  }

  if (final.product) {
    final.product = JSON.parse(final.product as string);
  }

  const time = `${final.hours}:${final.minutes} ${final.unit}`;

  try {
    // const response = await prisma.reminder.create({
    //   data: {
    //     description: final.description as string,
    //     dosageQty: final.dosageQty as string,
    //     dosageUnit: final.dosageUnit as string,
    //     routineId: params.id as string,
    //     product: final.product as any,
    //     time,
    //     daily: final.daily === "daily",
    //     timeRange: final.timeRange as string,
    //   },
    // });

    return json({
      success: true,
      data: final,
    });
  } catch (error) {
    return json({ success: false, error });
  }
}

const AddProductReminder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const productInitialState: AddProductType = {
    selectedProduct: null,
    productType: "",
    selectedDays: [],
    intakeFrequency: "daily",
    dosageQty: "1",
    dosageUnit: "",
  };

  const [product, setProduct] = useState(productInitialState);

  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  console.log(data);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);

    if (product.selectedDays.length > 0) {
      formData.append("customDays", JSON.stringify(product.selectedDays));
    }

    if (product.selectedProduct) {
      formData.append("product", JSON.stringify(product.selectedProduct[0]));
    }

    formData.append("dosageUnit", product.dosageUnit);
    formData.append("dosageQty", product.dosageQty);
    formData.append("productType", product.productType);
    formData.append("daily", product.intakeFrequency);

    submit(formData, { method: "post" });
  };

  return (
    <ValidatedForm
      method="post"
      validator={addProductValidator}
      onSubmit={handleSubmit}
    >
      <Page title="Add Product Reminder" narrowWidth>
        {currentStep === 1 && (
          <AddProduct
            setCurrentStep={setCurrentStep}
            product={product}
            setProduct={setProduct}
          />
        )}
        {currentStep === 2 && (
          <AddTimeSlot setCurrentStep={setCurrentStep} product={product} />
        )}

        <div
          style={{ marginTop: "10px", marginBottom: "30px", height: "100%" }}
        >
          <Button
            variant="primary"
            tone="critical"
            size="large"
            onClick={() => navigate("/app/routines")}
          >
            Cancel
          </Button>
        </div>
      </Page>
    </ValidatedForm>
  );
};

export default AddProductReminder;
