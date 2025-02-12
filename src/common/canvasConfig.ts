import { GateTypeEntity } from "../entities/other/GateTypeEntity";
import { Flow, Pos } from "./types";

// Pin
export const PIN_SIZE = 16; // diameter px

// Terminal
export const TERMINAL_PIN_OFFSET = (flow: Flow): Pos => ({ x: flow === Flow.In ? 56 : 0, y: 7.5 });

// Gate
export const GATE_PIN_OFFSET = (gateType: GateTypeEntity, flow: Flow, yPos: number): Pos => {
  const amount = flow === Flow.In ? gateType.inputs : gateType.outputs;
  const spacing = gateType.height / amount;
  const offsetY = spacing / 2 + spacing * yPos - PIN_SIZE / 2;
  const offsetX =
    (flow === Flow.In ? 0 : gateType.width) - PIN_SIZE / 2 + 5 * (flow === Flow.In ? -1 : 1);
  return { x: offsetX, y: offsetY };
};
