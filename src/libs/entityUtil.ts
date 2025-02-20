import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import { GateEntity } from "../entities/canvas/GateEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";

export function groupByEntityType<T>(
  entities: CanvasEntity[],
  consume: (terminals: TerminalEntity[], wires: WireEntity[], gates: GateEntity[]) => T,
): T {
  const terminals = entities
    .filter((entity) => entity instanceof TerminalEntity)
    .map((entity) => entity as TerminalEntity);
  const wires = entities
    .filter((entity) => entity instanceof WireEntity)
    .map((entity) => entity as WireEntity);
  const gates = entities
    .filter((entity) => entity instanceof GateEntity)
    .map((entity) => entity as GateEntity);

  return consume(terminals, wires, gates);
}
