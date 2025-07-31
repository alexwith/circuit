import { GateEntity } from "../entities/canvas/GateEntity";
import { WireEntity } from "../entities/canvas/WireEntity";

export function executeCircuit(  
  wires: WireEntity[],
  gates: GateEntity[]
) {
  for (let i = 0; i < gates.length + 1; i++) {
    wires.forEach((wire) => {
      wire.execute();
    });

    gates.forEach((gate) => {
      gate.execute();      

      wires.forEach((wire) => {
        wire.execute();
      });
    });
  }
}
