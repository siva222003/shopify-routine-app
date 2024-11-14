import { useFetcher, useNavigation } from "@remix-run/react";
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
import { useState, useEffect } from "react";
import {
  FileGridResponseType,
  FileGridType,
} from "~/routes/app.add-routine/types";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: FileGridType | null) => void;
  isLoading: boolean;
  data: FileGridType[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export default function ImageUploadModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  data,
  hasNextPage,
  endCursor,
}: DeleteConfirmModalProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selectedImage, setSelectedImage] = useState<FileGridType | null>(null);
  const [displayedData, setDisplayedData] = useState<FileGridType[]>(data);
  const [loadingMore, setLoadingMore] = useState(false); // New state for loading more data

  const fetcher = useFetcher<FileGridResponseType>();

  const hasNewPage = fetcher.data?.hasNextPage ?? hasNextPage;
  const endCursorNew = fetcher.data?.endCursor ?? endCursor;

  const moreData = fetcher.data?.files;

  // Only update displayedData when moreData changes, and append it to the existing data
  useEffect(() => {
    if (moreData) {
      setDisplayedData((prevData) => [...prevData, ...moreData]);
      setLoadingMore(false); // Set loadingMore to false when new data is loaded
    }
  }, [moreData]);

  // Initialize displayedData with the prop data once, when the component first mounts
  useEffect(() => {
    setDisplayedData(data);
  }, [data]);

  const handleCheckboxChange = (file: FileGridType) => {
    setSelectedImage(file);
  };

  const handleFetchMore = async () => {
    if (!hasNewPage || loadingMore) return; // Prevent multiple fetches at the same time
    setLoadingMore(true); // Set loadingMore to true when fetching more data
    fetcher.load(`/app/files?after=${endCursorNew}`);
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
              {displayedData.map((file) => (
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
                          selectedImage ? selectedImage.id === file.id : false
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
                        alt="Image"
                      />
                    </Box>
                  </div>
                </Grid.Cell>
              ))}
            </Grid>
          </Box>
        )}

        {hasNewPage && !loadingMore && (
          <Box padding={"400"}>
            <InlineStack align="end">
              <ButtonGroup>
                <Button
                  loading={isLoading}
                  disabled={isLoading || loadingMore || !hasNewPage}
                  onClick={handleFetchMore}
                  variant="primary"
                >
                  Load More
                </Button>
              </ButtonGroup>
            </InlineStack>
          </Box>
        )}

        {loadingMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Spinner size="large" />
          </div>
        )}

        <Divider />

        <Box padding={"400"}>
          <InlineStack align="end">
            <ButtonGroup>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting || !selectedImage}
                onClick={() => selectedImage && onConfirm(selectedImage)}
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
