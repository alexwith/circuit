import { Pos } from "../../common/types";

export abstract class CanvasEntity {
  abstract getPos(): Pos;

  abstract getZIndex(): number;
}
