import { useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { Badge, MediaCard } from "@shopify/polaris";
import { ActivityReminderType } from "~/routes/app.routine.$id/types";

interface Props {
  reminder: ActivityReminderType;
}

export default function ActivityReminderCard({ reminder }: Props) {
  const navigate = useNavigate();

  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" &&
    JSON.stringify(reminder._id) === navigation.formData?.get("id");

  console.log();

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
          <h1 style={{ fontWeight: "bold" }}>{reminder.name}</h1>{" "}
          <div>
            {" "}
            <Badge tone="attention">Activity</Badge>{" "}
          </div>
        </div>
      }
      primaryAction={{
        content: "Customize Reminder",
        onAction: () => {
          navigate(`/app/${reminder.reminderListId}/activity/${reminder._id}`);
        },
      }}
      secondaryAction={{
        content: "Delete",
        destructive: true,
        loading: isSubmitting,
        onAction: () => {
          submit(
            {
              _action: JSON.stringify("activityDelete"),
              id: JSON.stringify(reminder._id),
            },
            { method: "delete" },
          );
        },
      }}
      description={reminder.activityType === "mental" ? "Mental" : "Physical"}
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
