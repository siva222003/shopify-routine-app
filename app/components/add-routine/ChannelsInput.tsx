import { FieldValues, FormApi } from "@rvf/remix";
import { BlockStack, Tag, Autocomplete, InlineError } from "@shopify/polaris";
import { useState, useCallback, useMemo } from "react";
import { DefaultRoutine } from "~/types";

interface Props {
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  isChannelsError: string | null;
  setChannelsError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChannelsInput({
  selectedOptions,
  setSelectedOptions,
  isChannelsError,
  setChannelsError,
}: Props) {
  const deselectedOptions = useMemo(
    () => [
      { value: "email", label: "Email" },
      { value: "call", label: "Call" },
      { value: "whatsapp", label: "Whatsapp" },
      { value: "google-calendar", label: "Google Calendar" },
    ],
    [],
  );

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions],
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions],
  );

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <BlockStack gap="200" align="center">
        {selectedOptions.map((option) => {
          let tagLabel = "";
          tagLabel = option.replace("_", " ");
          tagLabel = titleCase(tagLabel);
          return (
            <Tag
              key={`option${option}`}
              size="large"
              onRemove={removeTag(option)}
            >
              {tagLabel}
            </Tag>
          );
        })}
      </BlockStack>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Channels"
      value={inputValue}
      placeholder="Call, Email"
      verticalContent={verticalContentMarkup}
      autoComplete="off"
      error={isChannelsError ? isChannelsError : undefined}
    />
  );

  return (
    <div>
      <Autocomplete
        allowMultiple
        options={options}
        selected={selectedOptions}
        textField={textField}
        onSelect={(value) => {
          if (isChannelsError) {
            setChannelsError(null);
          }

          setSelectedOptions(value);

          if (value.length === 0) {
            setChannelsError("Please select at least one channel");
          }
        }}
        listTitle="Suggested Tags"
      />
    </div>
  );

  function titleCase(string: string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join("");
  }
}
