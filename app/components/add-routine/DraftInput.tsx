import { Checkbox } from "@shopify/polaris";
import { useState, useCallback } from "react";

type Props = {
  draftValue?: boolean;
};

export default function DraftInput({ draftValue }: Props) {
  const [checked, setChecked] = useState(draftValue);
  const handleChange = useCallback(
    (newChecked: boolean) => setChecked(newChecked),
    [],
  );

  return (
    <Checkbox
      name="draft"
      value={checked ? "true" : "false"}
      label="Draft"
      checked={checked}
      onChange={handleChange}
    />
  );
}
