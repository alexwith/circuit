import { Pos } from "../../common/types";

export abstract class CanvasEntity {
  abstract getPos(): Pos;

  abstract updatePos(modifier: (prev: Pos) => Pos): void;

  abstract getZIndex(): number;

  abstract execute(): boolean;
}
