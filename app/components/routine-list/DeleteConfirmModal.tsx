import { useNavigation } from "@remix-run/react";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  InlineStack,
} from "@shopify/polaris";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal open={open} onHide={onClose}>
        <TitleBar title="Delete Confirmation" />
        <Box padding={"400"}>
          <p>Are you sure you want to delete this routine?</p>
        </Box>
        <Divider />

        <Box padding={"400"}>
          <InlineStack align="end">
            <ButtonGroup>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={onConfirm}
                variant="primary"
                tone="critical"
              >
                Delete
              </Button>
            </ButtonGroup>
          </InlineStack>
        </Box>
      </Modal>
    </div>
  );
}
