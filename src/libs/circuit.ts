import { GateEntity } from "../entities/canvas/GateEntity";
import { WireEntity } from "../entities/canvas/WireEntity";

const MAX_ITERATIONS = 10000;

export function executeCircuit(wires: WireEntity[], gates: GateEntity[]) {
  let changed = true;
  let iterations = 0;

  while (changed && iterations++ < MAX_ITERATIONS) {
    changed = false;

    for (const wire of wires) {
      const wireChanged = wire.execute();
      if (wireChanged) {
        changed = true;
      }
    }

    for (const gate of gates) {
      const gateChanged = gate.execute();
      if (gateChanged) {
        changed = true;
      }
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    console.warn("Circuit simulation reached max iterations");
  }
}
