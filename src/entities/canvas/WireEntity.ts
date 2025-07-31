import { Flow, Pos } from "../../common/types";
import { CanvasEntity } from "./CanvasEntity";
import { PinEntity } from "./PinEntity";
import { TerminalEntity } from "./TerminalEntity";

export class WireEntity extends CanvasEntity {
  pin0: PinEntity;
  pin1: PinEntity;
  points: Pos[];
  childPins: PinEntity[]; // these are pins of wires connected to this wire

  constructor(pin0: PinEntity, pin1: PinEntity, points: Pos[], childPins: PinEntity[]) {
    super();

    this.pin0 = pin0;
    this.pin1 = pin1;
    this.points = points;
    this.childPins = childPins;
  }

  getPos(): Pos {
    return this.pin0.getPos();
  }

  updatePos(): void {}

  getZIndex(): number {
    return this.isActive() ? -10 : -20;
  }

  isActive(): boolean {
    return this.pin0.active || this.pin1.active;
  }

  execute() {    
    if (this.pin0.parent instanceof TerminalEntity) {
      if (this.pin0.flow === Flow.In) {
        this.pin1.active = this.pin0.active;
      } else {
        this.pin0.active = this.pin1.active;
      }
    } else if (this.pin1.parent instanceof TerminalEntity) {
      if (this.pin1.flow === Flow.In) {
        this.pin0.active = this.pin1.active;
      } else {
        this.pin1.active = this.pin0.active;
      }    
    } else if (this.pin0.parent instanceof WireEntity) {
      this.pin0.active = this.pin0.parent.isActive();
      this.pin1.active = this.pin0.active;
    } else if (this.pin1.parent instanceof WireEntity) {
      this.pin1.active = this.pin1.parent.isActive();
      this.pin0.active = this.pin1.active;
    } else if (this.pin0.flow === Flow.Out && this.pin1.flow === Flow.In) {
      this.pin1.active = this.pin0.active;
    } else if (this.pin0.flow === Flow.In && this.pin1.flow === Flow.Out) {
      this.pin0.active = this.pin1.active;
    } else {      
      this.pin0.active = this.isActive();
      this.pin1.active = this.pin0.active;
    }

    for (const childPin of this.childPins) {      
      childPin.active = this.isActive();      
    }
  }
}
