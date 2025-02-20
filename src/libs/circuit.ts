import { GateEntity } from "../entities/canvas/GateEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";

export function executeCircuit(
  terminals: TerminalEntity[],
  wires: WireEntity[],
  gates: GateEntity[],
) {
  terminals.forEach((terminal) => {
    if (
      wires.filter((wire) => terminal.pin === wire.pin0 || terminal.pin === wire.pin1).length === 0
    ) {
      terminal.pin.active = false;
    }
  });

  for (let i = 0; i < gates.length; i++) {
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
