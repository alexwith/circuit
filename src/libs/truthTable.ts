import { Flow } from "../common/types";
import { GateEntity } from "../entities/canvas/GateEntity";
import { PinEntity } from "../entities/canvas/PinEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { WireEntity } from "../entities/canvas/WireEntity";
import { executeCircuit } from "./circuit";

export function computeTruthTable(
  terminals: TerminalEntity[],
  wires: WireEntity[],
  gates: GateEntity[]
): boolean[][] {  
  const truthTable: boolean[][] = [];

  const wirePins: PinEntity[] = [];
  wires.forEach((wire) => {
    wirePins.push(wire.pin0);
    wirePins.push(wire.pin1);
  });

  const inputTerminals = terminals
    .filter((terminal) => terminal.flow === Flow.In)    
    .filter((terminal) => wirePins.includes(terminal.pin))
    .sort((a, b) => a.pos.y - b.pos.y);
  const outputTerminals = terminals
    .filter((terminal) => terminal.flow === Flow.Out)
    .filter((terminal) => wirePins.includes(terminal.pin))
    .sort((a, b) => a.pos.y - b.pos.y);
  const combinationAmount = 1 << inputTerminals.length; // 2^inputTerminals cause Math#pow is slow

  const previousInputValues = inputTerminals.map((terminal) => terminal.pin.active);

  const inputCount = inputTerminals.length;
  const outputCount = outputTerminals.length;

  const combination = new Array(inputCount);
  const outputValues = new Array(outputCount);

  for (let i = 0; i < combinationAmount; i++) {    
    for (let j = 0; j < inputCount; j++) {
      combination[j] = Boolean(i & (1 << j));
      inputTerminals[j].pin.active = combination[i];
    }

    executeCircuit(wires, gates);
    
    for (let j = 0; j < outputCount; j++) {
      outputValues[j] = outputTerminals[j].pin.active;
    }

    const row = new Array(inputCount + outputCount);
    for (let j = 0; j < inputCount; j++) {
      row[j] = combination[j];
    }
    for (let j = 0; j < outputCount; j++) {
      row[inputCount + j] = outputValues[j];
    }

    truthTable.push(row);
  }

  inputTerminals.forEach((terminal, i) => {
    terminal.pin.active = previousInputValues[i];
  });

  executeCircuit(wires, gates);

  return truthTable;
}
