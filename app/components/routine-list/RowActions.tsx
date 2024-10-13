import { Form, useNavigate, useSubmit } from "@remix-run/react";
import { Button, Popover, ActionList } from "@shopify/polaris";
import { ImportIcon, ExportIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { api } from "~/utils/axios";

interface RowActionsProps {
  id: string;
}

export default function ActionListWithDestructiveItemExample({
  id,
}: RowActionsProps) {
  const submit = useSubmit();

  const [active, setActive] = useState(false);

  const handleSubmit = (intent: string) => {
    console.log("Form submitted");

    const formData = new FormData();
    formData.append("intent", intent);
    formData.append("id", id);

    submit(formData, { method: "delete" });
  };

  const navigate = useNavigate();

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const activator = (
    <Button onClick={toggleActive} disclosure>
      More actions
    </Button>
  );

  return (
    <form>
      <div style={{}} onClick={(e) => e.stopPropagation()}>
        <Popover
          active={active}
          activator={activator}
          // autofocusTarget="first-node"
          onClose={toggleActive}
        >
          <ActionList
            actionRole="menuitem"
            sections={[
              {
                items: [
                  {
                    // active: true,
                    content: "Clone",
                    icon: ImportIcon,
                    onAction: () => {
                      console.log("Clone action");
                      handleSubmit("clone");
                      setActive(false);
                    },
                  },
                  {
                    content: "Edit",
                    icon: ExportIcon,
                    onAction: () => {
                      console.log("Edit action");
                      navigate(`/app/routine/${id}`);
                    },
                  },
                  {
                    destructive: true,
                    content: "Delete",
                    icon: DeleteIcon,
                    onAction: async () => {
                      console.log("Delete action");
                      handleSubmit("delete");
                    },
                  },
                ],
              },
            ]}
          />
        </Popover>
      </div>
    </form>
  );
}
