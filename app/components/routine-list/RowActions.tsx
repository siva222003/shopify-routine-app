import { useNavigate } from "@remix-run/react";
import { Button, Popover, ActionList } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function RowActions() {
  const [popoverActive, setPopoverActive] = useState(false);

  const navigate = useNavigate();

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Actions
    </Button>
  );

  return (
    <div style={{}} onClick={(e) => e.stopPropagation()}>
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[{ content: "Clone" }, { content: "Edit" }]}
        />
      </Popover>
    </div>
  );
}
