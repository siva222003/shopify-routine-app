import { Badge, MediaCard } from "@shopify/polaris";
import { ProductReminderType } from "~/routes/app.routine.$id/types";

interface Props {
  reminder: ProductReminderType;
}

export default function ProductReminderCard({ reminder }: Props) {
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
          <h1 style={{ fontWeight: "bold" }}>{reminder.name}</h1>{" "}
          <div>
            {" "}
            <Badge tone="attention">Product</Badge>{" "}
          </div>
        </div>
      }
      primaryAction={{
        content: "Customize Reminder",
        onAction: () => {},
      }}
      description={
        reminder.productType === "applicationBased"
          ? "Application Based"
          : "Consumable"
      }
      popoverActions={[{ content: "Delete", onAction: () => {} }]}
      size="small"
    >
      <img
        alt=""
        width="100%"
        height="100%"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
        src={reminder.image}
      />
    </MediaCard>
  );
}
