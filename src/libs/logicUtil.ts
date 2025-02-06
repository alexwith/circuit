import { EntityType } from "../common/types";

export function isTerminal(type: EntityType) {
  return type === EntityType.InTerminal || type === EntityType.OutTerminal;
}
