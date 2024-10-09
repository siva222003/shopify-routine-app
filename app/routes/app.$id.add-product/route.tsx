import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { FormEvent, useMemo, useRef, useState } from "react";
import AddTimeSlot from "~/components/edit-routine/product-reminder/AddProductTimeSlot";
import AddProduct from "~/components/edit-routine/product-reminder/AddProduct";

import prisma from "../../db.server";
import { ValidatedForm } from "@rvf/remix";
import { addProductValidator } from "~/utils/validators";
import { AddProductType, ProductReminderInitialSlots } from "~/types";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const final = Object.fromEntries(formData.entries());

  if (final.customDays) {
    try {
      final.customDays = JSON.parse(final.customDays as string);
    } catch (error) {
      console.error("Invalid JSON for customDays:", final.customDays);
      return json({ success: false, error: "Invalid customDays JSON" });
    }
  }

  if (final.product) {
    try {
      final.product = JSON.parse(final.product as string);
    } catch (error) {
      console.error("Invalid JSON for product:", final.product);
      return json({ success: false, error: "Invalid product JSON" });
    }
  }

  const times = JSON.parse(final.times as string);

  final.times = times;

  delete final.rvfFormId;

  const test = {
    product: final.product as any,
    dosageQty: final.dosageQty as string,
    dosageUnit: final.dosageUnit as string,
    daily: final.daily === "daily",
    productType: final.productType as string,
    times,
    durationQty: final.durationQty as string,
    durationUnit: final.durationUnit as string,
    customDays: final.customDays as any,
    routineId: params.id as string,
  };

  try {
    const response = await prisma.productReminder.create({
      data: {
        product: final.product as any,
        dosageQty: final.dosageQty as string,
        dosageUnit: final.dosageUnit as string,
        daily: final.daily === "daily",
        productType: final.productType as string,
        times,
        durationQty: final.durationQty as string,
        durationUnit: final.durationUnit as string,
        customDays: final.customDays as any,
        routineId: params.id as string,
      },
    });

    return json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return json({ success: false, test });
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

  const initialSlotsState: ProductReminderInitialSlots = useMemo(() => {
    if (product?.productType === "consumable") {
      return {
        mealType: "",
        hours: "",
        minutes: "",
        timeUnit: "AM",
        mealTime: "before",
      };
    } else {
      return {
        hours: "",
        minutes: "",
        timeUnit: "AM",
      };
    }
  }, [product.productType]);

  const [slots, setSlots] = useState([initialSlotsState]);

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

    console.log({ product: product.selectedProduct });

    if (product.selectedProduct) {
      formData.append("product", JSON.stringify(product.selectedProduct));
    }

    formData.append("dosageUnit", product.dosageUnit);
    formData.append("dosageQty", product.dosageQty);
    formData.append("productType", product.productType);
    formData.append("daily", product.intakeFrequency);

    const times = slots.map((slot) => {
      if (slot.mealType) {
        return {
          mealType: slot.mealType,
          mealTime: slot.mealTime,
          time: `${slot.hours}:${slot.minutes} ${slot.timeUnit}`,
        };
      } else {
        return {
          time: `${slot.hours}:${slot.minutes} ${slot.timeUnit}`,
        };
      }
    });

    formData.append("times", JSON.stringify(times));

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
          <AddTimeSlot
            setCurrentStep={setCurrentStep}
            product={product}
            setSlots={setSlots}
            slots={slots}
            initialSlotsState={initialSlotsState}
          />
        )}

        <div
          style={{ marginTop: "10px", marginBottom: "30px", height: "100%" }}
        >
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
    </ValidatedForm>
  );
};

export default AddProductReminder;
