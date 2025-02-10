import { GATE_PIN_OFFSET, PIN_SIZE, TERMINAL_PIN_OFFSET } from "../../common/canvasConfig";
import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { GateEntity } from "./GateEntity";
import { TerminalEntity } from "./TerminalEntity";

export class PinEntity {
  parent: CanvasEntity;
  flow: Flow;
  yPos: number; // index representing where it is on the y-axis, i.g. 0, 1, 2, 3...

  constructor(parent: CanvasEntity, flow: Flow, yPos: number = 0) {
    this.parent = parent;
    this.flow = flow;
    this.yPos = yPos;
  }

  getPos(): Pos {
    const { x: parentX, y: parentY } = this.parent.getPos();

    switch (true) {
      case this.parent instanceof TerminalEntity: {
        const pinOffset = TERMINAL_PIN_OFFSET(this.flow);
        return {
          x: parentX + pinOffset.x + PIN_SIZE / 2,
          y: parentY + pinOffset.y + PIN_SIZE / 2,
        };
      }
      case this.parent instanceof GateEntity: {
        const pinOffset = GATE_PIN_OFFSET(this.parent.type, this.flow, this.yPos);
        return {
          x: parentX + pinOffset.x + PIN_SIZE / 2,
          y: parentY + pinOffset.y + PIN_SIZE / 2,
        };
      }
      default:
        return { x: 0, y: 0 };
    }
  }
}
