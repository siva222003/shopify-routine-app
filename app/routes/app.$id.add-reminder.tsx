import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Page } from "@shopify/polaris";
import { FormEvent, useState } from "react";
import AddMeals from "~/components/edit-routine/product-reminder/AddMeals";
import AddProduct from "~/components/edit-routine/product-reminder/AddProduct";

import prisma from "../db.server";

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
    const response = await prisma.reminder.create({
      data: {
        description: final.description as string,
        dosageQty: final.dosageQty as string,
        dosageUnit: final.dosageUnit as string,
        routineId: params.id as string,
        product: final.product as any,
        time,
        daily: final.daily === "daily",
        timeRange: final.timeRange as string,
      },
    });

    return json({
      success: true,
      data: response,
    });
  } catch (error) {
    return json({ success: false, error });
  }

  return json({ success: true, data: final });
}

const Testing = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [selected, setSelected] = useState<string[]>([]);

  const [value, setValue] = useState("daily");

  const [dosageQty, setDosageQty] = useState("1");

  const [dosageUnit, setDosageUnit] = useState("");

  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  console.log(data);

  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);

    if (selected.length > 0) {
      formData.append("customDays", JSON.stringify(selected));
    }

    if (selectedProduct) {
      formData.append("product", JSON.stringify(selectedProduct[0]));
    }

    formData.append("dosageUnit", dosageUnit);
    formData.append("dosageQty", dosageQty);
    formData.append("description", description);
    formData.append("daily", value);

    submit(formData, { method: "post" });
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Page title="Add Reminder Items" narrowWidth>
        {currentStep === 1 && (
          <AddProduct
            setCurrentStep={setCurrentStep}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selected={selected}
            setSelected={setSelected}
            value={value}
            setValue={setValue}
            dosageQty={dosageQty}
            setDosageQty={setDosageQty}
            dosageUnit={dosageUnit}
            setDosageUnit={setDosageUnit}
            description={description}
            setDescription={setDescription}
          />
        )}
        {currentStep === 2 && <AddMeals setCurrentStep={setCurrentStep} />}

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
    </Form>
  );
};

export default Testing;
