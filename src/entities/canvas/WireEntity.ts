import { Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { PinEntity } from "./PinEntity";

export class WireEntity extends CanvasEntity {
  pin0: PinEntity;
  pin1: PinEntity;
  points: Pos[];

  constructor(pin0: PinEntity, pin1: PinEntity, points: Pos[]) {
    super();

    this.pin0 = pin0;
    this.pin1 = pin1;
    this.points = points;
  }

  getPos(): Pos {
    return this.pin0.getPos();
  }

  getZIndex(): number {
    return -10;
  }
}
