import { useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { Badge, MediaCard } from "@shopify/polaris";
import { ProductReminderType } from "~/routes/app.routine.$id/types";

interface Props {
  reminder: ProductReminderType;
}

export default function ProductReminderCard({ reminder }: Props) {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" &&
    JSON.stringify(reminder._id) === navigation.formData?.get("id");

  const submit = useSubmit();

  return (
    <MediaCard
      title={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <h1 style={{ fontWeight: "bold" }}>
            {reminder.name.slice(0, 26) + "..."}{" "}
          </h1>{" "}
          <div>
            {" "}
            <Badge tone="attention">Product</Badge>{" "}
          </div>
        </div>
      }
      primaryAction={{
        content: "Customize Reminder",
        onAction: () => {
          navigate(`/app/${reminder.reminderListId}/product/${reminder._id}`);
        },
      }}
      secondaryAction={{
        content: "Delete",
        destructive: true,
        loading: isSubmitting,
        onAction: () => {
          submit(
            {
              _action: JSON.stringify("productDelete"),
              id: JSON.stringify(reminder._id),
            },
            { method: "delete" },
          );
        },
      }}
      description={
        reminder.productType === "applicationBased"
          ? "Application Based"
          : "Consumable"
      }
      size="small"
    >
      <img
        alt=""
        height="100%"
        width="100%"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        src={reminder.image}
      />
    </MediaCard>
  );
}