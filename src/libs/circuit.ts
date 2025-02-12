import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import { GateEntity } from "../entities/canvas/GateEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";

export function executeCircuit(entities: CanvasEntity[]) {
  const terminals = entities
    .filter((entity) => entity instanceof TerminalEntity)
    .map((entity) => entity as TerminalEntity);
  const wires = entities
    .filter((entity) => entity instanceof WireEntity)
    .map((entity) => entity as WireEntity);
  const gates = entities
    .filter((entity) => entity instanceof GateEntity)
    .map((entity) => entity as GateEntity);

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
