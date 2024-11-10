// import { useFetcher, useSubmit } from "@remix-run/react";
// import {
//   DropZone,
//   BlockStack,
//   Thumbnail,
//   Banner,
//   List,
//   Text,
//   Card,
//   Button,
// } from "@shopify/polaris";
// import { useState, useCallback, useEffect } from "react";

// interface ImageInputProps {
//   file: File | null;
//   setFile: React.Dispatch<React.SetStateAction<File | null>>;
// }

// export default function ImageInput({ file, setFile }: ImageInputProps) {
//   const fileFetcher = useFetcher();

//   const handleFetchFiles = async () => {
//     fileFetcher.load("/app/files");
//   };

//   console.log(fileFetcher.data);
//   // const [file, setFile] = useState<File | null>(null);
//   const [rejectedFile, setRejectedFile] = useState<File | null>(null);
//   const hasError = rejectedFile !== null;

//   const handleDrop = useCallback(
//     (_droppedFiles: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
//       acceptedFiles.length > 0 && setFile(acceptedFiles[0]);
//       rejectedFiles.length > 0 && setRejectedFile(rejectedFiles[0]);
//     },
//     [],
//   );

//   const submit = useSubmit();

//   useEffect(() => {
//     if (!file) return;

//     if (rejectedFile) {
//       setRejectedFile(null);
//     }

//     console.log(file);

//     const formData = new FormData();

//     formData.append("image", file);
//     formData.append("intent", "upload");

//     submit(formData, {
//       method: "POST",
//       encType: "multipart/form-data",
//     });
//   }, [file]);

//   const fileUpload = !file && <DropZone.FileUpload />;
//   const uploadedFiles = file !== null && (
//     <BlockStack>
//       <BlockStack align="start">
//         <Thumbnail
//           alt={file.name}
//           size="large"
//           source={window.URL.createObjectURL(file)}
//         />
//         <div>
//           {file.name}{" "}
//           {/* <Text variant="bodySm" as="p">
//             {file.size} bytes
//           </Text> */}
//         </div>
//       </BlockStack>
//     </BlockStack>
//   );

//   const errorMessage = hasError && (
//     <Banner title="The following images couldn’t be uploaded:" tone="critical">
//       <List type="bullet">
//         <List.Item>
//           {`"${rejectedFile?.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
//         </List.Item>
//       </List>
//     </Banner>
//   );

//   return (
//     <Card>
//       <BlockStack gap={"300"}>
//         {errorMessage}
//         <div>
//           <DropZone
//             id="image-dropzone"
//             allowMultiple={false}
//             accept=".jpg,.png,.gif,.svg"
//             type="image"
//             onDrop={handleDrop}
//           >
//             {uploadedFiles}
//             {fileUpload}
//           </DropZone>
//         </div>
//       </BlockStack>
//       <Button onClick={handleFetchFiles}>Send</Button>
//     </Card>
//   );
// }

import { Box, Button, ButtonGroup, Card, InlineStack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import ImageUploadModal from "./ui/ImageUploadModal";
import { useFetcher } from "@remix-run/react";
import {
  FileGridResponseType,
  FileGridType,
} from "~/routes/app.add-routine/types";
import { FormApi } from "@rvf/remix";

interface ImageInputProps {
  form: FormApi<any>;
}

const ImageInput = ({ form }: ImageInputProps) => {
  const [showModal, setShowModal] = useState(false);
  const fileFetcher = useFetcher<FileGridResponseType>();
  const [selectedImage, setSelectedImage] = useState<FileGridType | null>(
    !!form.value("image")
      ? ({ preview: { image: { url: form.value("image") } } } as FileGridType)
      : null,
  );

  useEffect(() => {
    if (!!form.value("image")) {
      setSelectedImage({
        preview: {
          image: {
            url: form.value("image"),
          },
        },
      } as FileGridType);
    }
  }, [form.value("image")]);

  const handleFetchFiles = async () => {
    fileFetcher.load("/app/files");
  };

  const data = fileFetcher.data as FileGridResponseType | undefined;

  const onClose = () => {
    setShowModal(false);
  };

  const onConfirm = (file: FileGridType | null) => {
    if (file === null || file.id === selectedImage?.id) {
      setShowModal(false);
      return;
    }

    setSelectedImage(file);
    form.setValue("image", file.preview.image.url);
    setShowModal(false);
  };

  const onImageChange = () => {
    if (data && data.files) {
      setShowModal(true);
    } else {
      handleFetchFiles();
      setShowModal(true);
    }
  };

  return (
    <>
      <ImageUploadModal
        data={(data && data.files) ?? []}
        isLoading={fileFetcher.state === "loading"}
        open={showModal}
        onClose={onClose}
        onConfirm={onConfirm}
      />
      {selectedImage ? (
        <Card>
          <InlineStack>
            <Box>
              <img
                src={selectedImage.preview.image.url}
                style={{ width: "100%" }}
              />
            </Box>
            <Box>
              <ButtonGroup>
                <Button onClick={onImageChange}>Change Image</Button>
                <Button
                  variant="secondary"
                  tone="critical"
                  onClick={() => {
                    setSelectedImage(null);
                    form.setValue("image", "");
                  }}
                >
                  Remove Image
                </Button>
              </ButtonGroup>
            </Box>
          </InlineStack>
        </Card>
      ) : (
        <Card>
          <Box
            borderWidth="025"
            minHeight="100px"
            paddingBlock={"800"}
            borderColor="border-brand"
            borderStyle="dashed"
            borderRadius="300"
          >
            <InlineStack align="center">
              <Button
                onClick={() => {
                  handleFetchFiles();
                  setShowModal(true);
                }}
              >
                Select Image
              </Button>
            </InlineStack>
          </Box>
        </Card>
      )}

      <input
        hidden
        name="image"
        value={form.value("image")}
        onChange={() => {}}
        type="text"
      />
    </>
  );
};

export default ImageInput;
