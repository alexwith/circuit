import { ReactNode } from "react";
import { Pos } from "../../common/types";
import { PIN_SIZE } from "../../common/canvasConfig";

export type GateTypeEntity = {
  name: string;
  nameOffset: Pos;
  inputs: number;
  outputs: number;
  truthTable: { [inputs: string]: string };
  width: number;
  height: number;
  icon?: ReactNode;
};

export function createGateTypeEntity(
  name: string,
  inputs: number,
  outputs: number,
  truthTable: { [inputs: string]: string },
) {
  return {
    name,
    inputs,
    outputs,
    nameOffset: { x: 0, y: 0 },
    truthTable,
    width: PIN_SIZE + 4 + 13 * name.length,
    height: Math.max((PIN_SIZE + 6) * Math.max(inputs, outputs), 30),
  };
}
