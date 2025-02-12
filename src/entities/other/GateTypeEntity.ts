import { ReactNode } from "react";

export type GateTypeEntity = {
  name: string;
  inputs: number;
  outputs: number;
  truthTable: { [inputs: string]: string };
  width: number;
  height: number;
  icon: ReactNode;
};
