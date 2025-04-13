import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { PinEntity } from "./PinEntity";

export class TerminalEntity extends CanvasEntity {
  pos: Pos;
  flow: Flow;
  group: TerminalEntity[];
  pin: PinEntity;
  name: string;

  constructor(pos: Pos, flow: Flow, group: TerminalEntity[], name?: string) {
    super();

    this.pos = pos;
    this.flow = flow;
    this.group = group;
    this.pin = new PinEntity(this, flow);
    this.name = name || "?";
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
