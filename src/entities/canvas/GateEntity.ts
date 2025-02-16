import { Flow, Pos } from "../../common/types";
import { GateTypeEntity } from "../other/GateTypeEntity";
import { CanvasEntity } from "./CanvasEntity";
import { PinEntity } from "./PinEntity";

export class GateEntity extends CanvasEntity {
  pos: Pos;
  type: GateTypeEntity;
  inputs: PinEntity[];
  outputs: PinEntity[];

  constructor(pos: Pos, type: GateTypeEntity) {
    super();

    this.pos = pos;
    this.type = type;
    this.inputs = this.createPins(Flow.In);
    this.outputs = this.createPins(Flow.Out);
  }

  getPos(): Pos {
    return this.pos;
  }

  updatePos(modifier: (prev: Pos) => Pos): void {
    this.pos = modifier(this.pos);
  }

  getZIndex(): number {
    return 0;
  }

  execute() {
    let inputValues = "";
    for (const pin of this.inputs) {
      inputValues += pin.active ? "1" : "0";
    }

    let outputValues: boolean[] = [];
    for (const inputValuation in this.type.truthTable) {
      if (inputValuation !== inputValues) {
        continue;
      }

      const outputValuation = this.type.truthTable[inputValuation];
      for (let i = 0; i < outputValuation.length; i++) {
        const active = outputValuation.charAt(i) === "1";
        outputValues.push(active);
      }
      break;
    }

    if (outputValues.length === 0) {
      outputValues = Array(this.type.outputs).fill(false, 0, this.type.outputs);
    }

    for (let i = 0; i < outputValues.length; i++) {
      const outputPin = this.outputs[i];
      outputPin.active = outputValues[i];
    }
  }

  private createPins(flow: Flow): PinEntity[] {
    const pins: PinEntity[] = [];
    const amount = flow === Flow.In ? this.type.inputs : this.type.outputs;
    for (let i = 0; i < amount; i++) {
      pins.push(new PinEntity(this, flow, i));
    }
    return pins;
  }
}
