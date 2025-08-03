import { GATE_PIN_OFFSET, PIN_SIZE, TERMINAL_PIN_OFFSET } from "../../common/canvasConfig";
import { Flow, Pos } from "../../common/types";
import { closestPosOnLine } from "../../libs/posUtil";
import { CanvasEntity } from "./CanvasEntity";
import { GateEntity } from "./GateEntity";
import { TerminalEntity } from "./TerminalEntity";
import { WireEntity } from "./WireEntity";

export class PinEntity {
  parent: CanvasEntity | null;
  flow: Flow;
  yPos: number; // index representing where it is on the y-axis, i.g. 0, 1, 2, 3...
  pos: Pos | undefined;
  active: boolean;

  constructor(
    parent: CanvasEntity | null,
    flow: Flow,
    yPos: number = 0,
    pos: Pos | undefined = undefined
  ) {
    this.parent = parent;
    this.flow = flow;
    this.yPos = yPos;
    this.pos = pos;
    this.active = false;
  }

  getPos(): Pos {
    if (!this.parent) {
      return { x: 0, y: 0 };
    }

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
      // If this pins parent is a wire and is connected to another wire, we try to glue it to the other wire
      case this.parent instanceof WireEntity && this.pos != undefined: {
        const points = [
          this.parent.pin0.getPos(),
          ...this.parent.points,
          this.parent.pin1.getPos(),
        ];
        let closestPoint = null;
        let minDistSq = Infinity;

        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i];
          const b = points[i + 1];

          const candidatePoint = closestPosOnLine(a, b, this.pos);
          const dx = candidatePoint.x - this.pos.x;
          const dy = candidatePoint.y - this.pos.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < 1) {
            return this.pos;
          }

          if (distanceSq < minDistSq) {
            minDistSq = distanceSq;
            closestPoint = candidatePoint;
          }
        }

        this.pos = closestPoint!!;
        return this.pos;
      }
      default:
        return { x: 0, y: 0 };
    }
  }
}
