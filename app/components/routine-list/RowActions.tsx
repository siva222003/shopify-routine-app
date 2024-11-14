import { useNavigation, useSubmit } from "@remix-run/react";
import { Button, Popover, ActionList } from "@shopify/polaris";
import { ImportIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface RowActionsProps {
  id: string;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ActionListWithDestructiveItemExample({
  id,
  showDeleteModal,
  setShowDeleteModal,
}: RowActionsProps) {
  const submit = useSubmit();
  const [active, setActive] = useState(false);

  const handleSubmit = (intent: string) => {
    const formData = new FormData();
    formData.append("intent", intent);
    formData.append("id", id);

    if (intent === "clone") {
      submit(formData, { method: "post" });
    } else {
      submit(formData, { method: "delete" });
    }
  };

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setActive(false);
  };

  const handleDelete = () => {
    handleSubmit("delete");
  };

  const activator = (
    <Button onClick={toggleActive} disclosure>
      More actions
    </Button>
  );

  return (
    <form>
      <div onClick={(e) => e.stopPropagation()}>
        <Popover active={active} activator={activator} onClose={toggleActive}>
          <ActionList
            actionRole="menuitem"
            sections={[
              {
                items: [
                  {
                    content: "Clone",
                    icon: ImportIcon,
                    disabled: isSubmitting || navigation.state === "loading",
                    onAction: () => {
                      handleSubmit("clone");
                      setActive(false);
                    },
                  },
                  {
                    destructive: true,
                    content: "Delete",
                    disabled: isSubmitting || navigation.state === "loading",
                    icon: DeleteIcon,
                    onAction: openDeleteModal,
                  },
                ],
              },
            ]}
          />
        </Popover>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </form>
  );
}
