import { Flow } from "../common/types";
import { GateEntity } from "../entities/canvas/GateEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";
import { executeCircuit } from "./circuit";

export function computeTruthTable(
  terminals: TerminalEntity[],
  wires: WireEntity[],
  gates: GateEntity[]
): boolean[][] {      
  const truthTable: boolean[][] = [];

  const inputTerminals = terminals.filter((pin) => pin.flow === Flow.In).sort((a, b) => a.pos.y - b.pos.y);  
  const outputTerminals = terminals.filter((pin) => pin.flow === Flow.Out).sort((a, b) => a.pos.y - b.pos.y);
  const combinationAmount = 1 << inputTerminals.length; // 2^inputTerminals cause Math#pow is slow

  const previousInputValues = inputTerminals.sort((a, b) => a.pos.y - b.pos.y).map((terminal) => terminal.pin.active);

  for (let i = 0; i < combinationAmount; i++) {
    const combination = [];
    for (let j = 0; j < inputTerminals.length; j++) {
      combination[j] = Boolean(i & (1 << j));      
    }

    for (let i = 0; i < combination.length; i++) {
      inputTerminals[i].pin.active = combination[i];
    }

    executeCircuit(wires, gates);

    const outputValues = outputTerminals.map((terminal) => terminal.pin.active);

    truthTable.push(combination.concat(outputValues));
  }

  inputTerminals.forEach((terminal, i) => {
    terminal.pin.active = previousInputValues[i];
  });

  executeCircuit(wires, gates);  
  
  return truthTable;
}