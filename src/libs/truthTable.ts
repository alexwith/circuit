import { Flow } from "../common/types";
import { GateEntity } from "../entities/canvas/GateEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";
import { executeCircuit } from "./circuit";

export function computeTruthTable(
  terminals: TerminalEntity[],
  wires: WireEntity[],
  gates: GateEntity[],
): boolean[][] {
  const truthTable: boolean[][] = [];

  const inputTerminals = terminals.filter((pin) => pin.flow === Flow.In);
  const combinationAmount = 1 << inputTerminals.length; // 2^inputTerminals cause Math#pow is slow
  const combinations: boolean[][] = [];
  for (let i = 0; i < combinationAmount; i++) {
    combinations.push([]);
    for (let j = 0; j < inputTerminals.length; j++) {
      if (((1 << j) & i) > 0) {
        combinations[i][j] = true;
      } else {
        combinations[i][j] = false;
      }
    }
  }

  const previousInputValues = terminals
    .filter((terminal) => terminal.flow === Flow.In)
    .map((terminal) => terminal.pin.active);

  combinations.forEach((combination) => {
    for (let i = 0; i < combination.length; i++) {
      inputTerminals[i].pin.active = combination[i];
    }

    executeCircuit(terminals, wires, gates);

    const outputValues: boolean[] = [];
    terminals
      .filter((pin) => pin.flow === Flow.Out)
      .forEach((outputTerminal) => {
        const outputValue = outputTerminal.pin.active;
        outputValues.push(outputValue);
      });

    truthTable.push(combination.concat(outputValues));
  });

  terminals
    .filter((terminal) => terminal.flow === Flow.In)
    .forEach((terminal, i) => (terminal.pin.active = previousInputValues[i]));

  return truthTable;
}
