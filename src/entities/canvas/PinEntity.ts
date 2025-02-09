import { PIN_SIZE, TERMINAL_PIN_OFFSET } from "../../common/canvasConfig";
import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { TerminalEntity } from "./TerminalEntity";

export class PinEntity {
  parent: CanvasEntity;
  flow: Flow;

  constructor(parent: CanvasEntity, flow: Flow) {
    this.parent = parent;
    this.flow = flow;
  }

  getPos(): Pos {
    if (this.parent instanceof TerminalEntity) {
      const { x: parentX, y: parentY } = this.parent.getPos();
      const pinOffset = TERMINAL_PIN_OFFSET(this.flow);
      return {
        x: parentX + pinOffset.x + PIN_SIZE / 2,
        y: parentY + pinOffset.y + PIN_SIZE / 2,
      };
    }

    return { x: 0, y: 0 };
  }
}
