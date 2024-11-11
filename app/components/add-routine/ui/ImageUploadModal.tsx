import { useNavigation } from "@remix-run/react";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  InlineStack,
  Text,
  Spinner,
  Checkbox,
} from "@shopify/polaris";
import { useState } from "react";
import { FileGridType } from "~/routes/app.add-routine/types";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: FileGridType | null) => void;
  isLoading: boolean;
  data: FileGridType[];
}

export default function ImageUploadModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  data,
}: DeleteConfirmModalProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // State to track selected images
  const [selectedImage, setSelectedImage] = useState<FileGridType | null>(null);

  // Toggle selection state of an image
  const handleCheckboxChange = (file: FileGridType) => {
    setSelectedImage(file);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal variant="large" open={open} onHide={onClose}>
        <TitleBar title="Select Image" />

        {isLoading ? (
          <Box minHeight="300px">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Spinner />
            </div>
          </Box>
        ) : (
          <Box padding={"500"}>
            <Text as="h6" variant="bodyLg">
              Select an image from the list
            </Text>

            <div style={{ marginBlock: "20px" }}></div>

            <Grid columns={{ xs: 2, sm: 3, md: 6 }}>
              {data.map((file) => (
                <Grid.Cell key={file.id}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        zIndex: 1,
                      }}
                    >
                      <Checkbox
                        label=""
                        checked={
                          selectedImage
                            ? selectedImage.id === file.id
                              ? true
                              : false
                            : false
                        }
                        onChange={() => handleCheckboxChange(file)}
                      />
                    </div>
                    <Box
                      padding={"100"}
                      borderWidth="025"
                      borderColor="border-brand"
                      borderRadius="300"
                    >
                      <img
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                        height={"130px"}
                        loading="lazy"
                        width={"100%"}
                        src={file.preview.image.url}
                        alt="Black choker necklace"
                      />
                    </Box>
                  </div>
                </Grid.Cell>
              ))}
            </Grid>
          </Box>
        )}

        <Divider />

        <Box padding={"400"}>
          <InlineStack align="end">
            <ButtonGroup>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => onConfirm(selectedImage)}
                variant="primary"
              >
                Add
              </Button>
            </ButtonGroup>
          </InlineStack>
        </Box>
      </Modal>
    </div>
  );
}
