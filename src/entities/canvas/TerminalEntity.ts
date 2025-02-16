import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { PinEntity } from "./PinEntity";

export class TerminalEntity extends CanvasEntity {
  pos: Pos;
  flow: Flow;
  pin: PinEntity;

  constructor(pos: Pos, flow: Flow) {
    super();

    this.pos = pos;
    this.flow = flow;
    this.pin = new PinEntity(this, flow);
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
}
