import { ReactNode } from "react";

export type GateTypeEntity = {
  name: string;
  inputs: number;
  outputs: number;
  width: number;
  height: number;
  icon: ReactNode;
};
