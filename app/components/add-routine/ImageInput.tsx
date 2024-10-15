import { useSubmit } from "@remix-run/react";
import {
  DropZone,
  BlockStack,
  Thumbnail,
  Banner,
  List,
  Text,
  Card,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

interface ImageInputProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageInput({ file, setFile }: ImageInputProps) {
  // const [file, setFile] = useState<File | null>(null);
  const [rejectedFile, setRejectedFile] = useState<File | null>(null);
  const hasError = rejectedFile !== null;

  const handleDrop = useCallback(
    (_droppedFiles: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
      acceptedFiles.length > 0 && setFile(acceptedFiles[0]);
      rejectedFiles.length > 0 && setRejectedFile(rejectedFiles[0]);
    },
    [],
  );

  const submit = useSubmit();

  useEffect(() => {
    if (!file) return;

    if (rejectedFile) {
      setRejectedFile(null);
    }

    console.log(file);

    const formData = new FormData();

    formData.append("image", file);
    formData.append("intent", "upload");

    submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  }, [file]);

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFiles = file !== null && (
    <BlockStack>
      <BlockStack align="start">
        <Thumbnail
          alt={file.name}
          size="large"
          source={window.URL.createObjectURL(file)}
        />
        <div>
          {file.name}{" "}
          {/* <Text variant="bodySm" as="p">
            {file.size} bytes
          </Text> */}
        </div>
      </BlockStack>
    </BlockStack>
  );

  const errorMessage = hasError && (
    <Banner title="The following images couldn’t be uploaded:" tone="critical">
      <List type="bullet">
        <List.Item>
          {`"${rejectedFile?.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
        </List.Item>
      </List>
    </Banner>
  );

  return (
    <Card>
      <BlockStack gap={"300"}>
        {errorMessage}
        <div>
          <DropZone
            id="image-dropzone"
            allowMultiple={false}
            accept=".jpg,.png,.gif,.svg"
            type="image"
            onDrop={handleDrop}
          >
            {uploadedFiles}
            {fileUpload}
          </DropZone>
        </div>
      </BlockStack>
    </Card>
  );
}
