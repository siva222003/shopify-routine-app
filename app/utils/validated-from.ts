import { useField } from "@rvf/remix";

export function getError(name: string) {
  return useField(name).error();
}
