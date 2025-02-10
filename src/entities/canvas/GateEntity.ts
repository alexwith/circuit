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

  getZIndex(): number {
    return 0;
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
