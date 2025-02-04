import { Pos } from "../common/types";
import CanvasEntity from "./CanvasEntity";

export default class TerminalEntity extends CanvasEntity {
  constructor(pos: Pos) {
    super(pos);
  }
}
