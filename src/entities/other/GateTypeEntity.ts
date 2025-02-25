import { ReactNode } from "react";
import { Pos } from "../../common/types";

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
