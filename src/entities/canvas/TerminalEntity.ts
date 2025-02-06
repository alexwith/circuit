import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";

export class TerminalEntity extends CanvasEntity {
  constructor(pos: Pos, flow: Flow) {
    super(pos, flow);
  }
}
