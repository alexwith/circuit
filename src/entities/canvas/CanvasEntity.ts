import { Flow, Pos } from "../../common/types";

export class CanvasEntity {
  pos: Pos;
  flow: Flow;

  constructor(pos: Pos, flow: Flow) {
    this.pos = pos;
    this.flow = flow;
  }
}
