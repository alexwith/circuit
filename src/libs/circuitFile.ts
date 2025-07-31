import { Buffer } from "buffer";
import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import OffsetBuffer from "./OffsetBuffer";
import { getEntityType, groupByEntityType } from "./entityUtil";
import { createGateTypeEntity, GateTypeEntity } from "../entities/other/GateTypeEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { GateEntity } from "../entities/canvas/GateEntity";
import { WireEntity } from "../entities/canvas/WireEntity";
import { EntityType, Flow, Pos } from "../common/types";
import { basicCircuits } from "../common/basicGates";
import { PinEntity } from "../entities/canvas/PinEntity";

/*
Circuit file format

1 bytes - magic, id file type = 0x43
1 byte - version = 0x01

2 bytes - gate types size
    string - name
    1 byte - input amount
    1 byte - output amount
    2 bytes - valuation entries
        string - valuation on the format "{inputs}:{outputs}", e.g. "000:11"

2 bytes - gates size
    2 bytes - gate type index
    2 bytes - x position
    2 bytes - y position

2 bytes - terminals size
    1 byte - flow
    string - name
    2 bytes - x position
    2 bytes - y position

terminals
  2 bytes - group size
      2 bytes - terminal index

2 bytes - wires size
    1 byte - pin0 parent type (EntityType)
    2 byte - pin0 parent index
    1 byte - pin0 pin index
    2 byte - pin0 x position (Only if pin0's parent is a wire)
    2 byte - pin0 y position (Only if pin0's parent is a wire)
    1 byte - pin0 flow
    1 byte - pin1 parent type (EntityType)
    2 byte - pin1 parent index
    1 byte - pin1 pin index
    2 byte - pin1 x position (Only if pin0's parent is a wire)
    2 byte - pin1 y position (Only if pin0's parent is a wire)
    1 byte - pin1 flow
    2 bytes - points size
        2 bytes - x position
        2 bytes - y positon
*/

export function serialize(gateTypes: GateTypeEntity[], entities: CanvasEntity[]): Buffer {  
  const size = calculateBufferSize(gateTypes, entities);
  const buffer = new OffsetBuffer(Buffer.alloc(size));
  buffer.writeUInt8(0x43); // magic
  buffer.writeUInt8(0x01); // version

  buffer.writeUInt16(gateTypes.length - basicCircuits.length);
  for (const gateType of gateTypes) {
    if (basicCircuits.find((basicGate) => basicGate.name === gateType.name)) {
      continue;
    }

    buffer.writeString(gateType.name);
    buffer.writeUInt8(gateType.inputs);
    buffer.writeUInt8(gateType.outputs);

    const truthTableEntries = Object.entries(gateType.truthTable);
    buffer.writeUInt16(truthTableEntries.length);
    for (const [input, output] of truthTableEntries) {
      buffer.writeString(input + ":" + output);
    }
  }

  serializeEntities(buffer, gateTypes, entities);

  return buffer.buffer;
}

export function deserialize(data: ArrayBuffer): [GateTypeEntity[], CanvasEntity[]] | null {
  const buffer = new OffsetBuffer(Buffer.from(data));

  try {
    const magic = buffer.readUInt8();
    if (magic !== 0x43) {
      console.log("The file is not a circuit file.");
      return null;
    }
  } catch {
    return null;
  }

  buffer.readUInt8(); // read version

  const gateTypes: GateTypeEntity[] = [];
  gateTypes.push(...basicCircuits);

  const gateTypesSize = buffer.readUInt16();
  for (let i = 0; i < gateTypesSize; i++) {
    const name = buffer.readString();
    const inputs = buffer.readUInt8();
    const outputs = buffer.readUInt8();

    const truthTable: { [inputs: string]: string } = {};
    const truthTableEntries = buffer.readUInt16();
    for (let j = 0; j < truthTableEntries; j++) {
      const valuation = buffer.readString();
      const args = valuation.split(":");
      truthTable[args[0]] = args[1];
    }

    gateTypes.push(createGateTypeEntity(name, inputs, outputs, truthTable));
  }

  const entities = deserializeEntities(buffer, gateTypes);
  return [gateTypes, entities];
}

function serializeEntities(
  buffer: OffsetBuffer,
  gateTypes: GateTypeEntity[],
  entities: CanvasEntity[]
) {
  groupByEntityType(entities, (terminals, wires, gates) => {
    const processedEntities: CanvasEntity[] = [];

    buffer.writeUInt16(gates.length);
    for (const gate of gates) {
      buffer.writeUInt16(gateTypes.indexOf(gate.type));
      buffer.writeUInt16(gate.pos.x);
      buffer.writeUInt16(gate.pos.y);
      processedEntities.push(gate);
    }

    buffer.writeUInt16(terminals.length);
    for (const terminal of terminals) {
      buffer.writeUInt8(terminal.flow);
      buffer.writeString(terminal.name);
      buffer.writeUInt16(terminal.pos.x);
      buffer.writeUInt16(terminal.pos.y);

      processedEntities.push(terminal);
    }

    for (const terminal of terminals) {
      buffer.writeUInt16(terminal.group.length);
      for (const relatedTerminal of terminal.group) {
        buffer.writeUInt16(processedEntities.indexOf(relatedTerminal));
      }
    }

    buffer.writeUInt16(wires.length);
    for (const wire of wires) {
      const parent0 = wire.pin0.parent;
      const parent0Type = getEntityType(parent0!)!;
      buffer.writeUInt8(parent0Type);
      buffer.writeUInt16(
        parent0 instanceof WireEntity ? wires.indexOf(parent0) : processedEntities.indexOf(parent0!)
      );
      buffer.writeUInt8(wire.pin0.yPos);
      buffer.writeUInt8(wire.pin0.flow);

      if (parent0 instanceof WireEntity) {
        buffer.writeUInt16(wire.pin0.pos!!.x);
        buffer.writeUInt16(wire.pin0.pos!!.y);
      }

      const parent1 = wire.pin1.parent;
      const parent1Type = getEntityType(parent1!)!;
      buffer.writeUInt8(parent1Type);
      buffer.writeUInt16(
        parent1 instanceof WireEntity ? wires.indexOf(parent1) : processedEntities.indexOf(parent1!)
      );
      buffer.writeUInt8(wire.pin1.yPos);
      buffer.writeUInt8(wire.pin1.flow);

      if (parent1 instanceof WireEntity) {
        buffer.writeUInt16(wire.pin1.pos!!.x);
        buffer.writeUInt16(wire.pin1.pos!!.y);
      }

      buffer.writeUInt16(wire.points.length);
      for (const point of wire.points) {
        buffer.writeUInt16(point.x);
        buffer.writeUInt16(point.y);
      }
    }
  });
}

function deserializeEntities(buffer: OffsetBuffer, gateTypes: GateTypeEntity[]): CanvasEntity[] {
  const entities: CanvasEntity[] = [];

  const gatesSize = buffer.readUInt16();
  for (let i = 0; i < gatesSize; i++) {
    const type = gateTypes[buffer.readUInt16()];
    const pos = { x: buffer.readUInt16(), y: buffer.readUInt16() };
    entities.push(new GateEntity(pos, type));
  }

  const terminalsSize = buffer.readUInt16();
  for (let i = 0; i < terminalsSize; i++) {
    const flow = buffer.readUInt8();
    const name = buffer.readString();
    const pos = { x: buffer.readUInt16(), y: buffer.readUInt16() };

    entities.push(new TerminalEntity(pos, flow, [], name));
  }

  for (let i = 0; i < terminalsSize; i++) {
    const terminal = entities[entities.length - terminalsSize + i] as TerminalEntity;
    const groupSize = buffer.readUInt16();
    for (let j = 0; j < groupSize; j++) {
      const relatedIndex = buffer.readUInt16();
      terminal.group.push(entities[relatedIndex] as TerminalEntity);
    }
  }

  const wires: WireEntity[] = [];
  const waitingForParentWire = new Map<PinEntity, number>();
  const wiresSize = buffer.readUInt16();
  for (let i = 0; i < wiresSize; i++) {
    const pin0ParentType = buffer.readUInt8();
    const isPin0ParentWire = pin0ParentType == EntityType.Wire;
    const pin0Parent = isPin0ParentWire ? buffer.readUInt16() : entities[buffer.readUInt16()];
    const pin0YPos = buffer.readUInt8();
    const pin0Flow = buffer.readUInt8();
    const pin0PosX = isPin0ParentWire ? buffer.readUInt16() : 0; // Only used for wires connected to wires
    const pin0PosY = isPin0ParentWire ? buffer.readUInt16() : 0; // Only used for wires connected to wires

    const pin1ParentType = buffer.readUInt8();
    const isPin1ParentWire = pin1ParentType == EntityType.Wire;
    const pin1Parent = isPin1ParentWire ? buffer.readUInt16() : entities[buffer.readUInt16()];
    const pin1YPos = buffer.readUInt8();
    const pin1Flow = buffer.readUInt8();
    const pin1PosX = isPin1ParentWire ? buffer.readUInt16() : 0; // Only used for wires connected to wires
    const pin1PosY = isPin1ParentWire ? buffer.readUInt16() : 0; // Only used for wires connected to wires

    let pin0 = null;
    if (pin0ParentType == EntityType.Wire) {
      pin0 = new PinEntity(null, Flow.In, 0); // We can't be sure that the parent wire exists yet
      pin0.pos = { x: pin0PosX, y: pin0PosY };
      waitingForParentWire.set(pin0, pin0Parent as number);
    } else if (pin0Parent instanceof TerminalEntity) {
      pin0 = pin0Parent.pin;
    } else if (pin0Parent instanceof GateEntity) {
      pin0 = pin0Flow === Flow.In ? pin0Parent.inputs[pin0YPos] : pin0Parent.outputs[pin0YPos];
    }

    let pin1 = null;
    if (pin1ParentType == EntityType.Wire) {
      pin1 = new PinEntity(null, Flow.In, 0); // We can't be sure that the parent wire exists yet
      pin1.pos = { x: pin1PosX, y: pin1PosY };
      waitingForParentWire.set(pin1, pin1Parent as number);
    } else if (pin1Parent instanceof TerminalEntity) {
      pin1 = pin1Parent.pin;
    } else if (pin1Parent instanceof GateEntity) {
      pin1 = pin1Flow === Flow.In ? pin1Parent.inputs[pin1YPos] : pin1Parent.outputs[pin1YPos];
    }

    if (!pin0 || !pin1) {
      continue;
    }

    const pointsSize = buffer.readUInt16();
    const points: Pos[] = [];
    for (let i = 0; i < pointsSize; i++) {
      const pos = { x: buffer.readUInt16(), y: buffer.readUInt16() };
      points.push(pos);
    }

    const wire = new WireEntity(pin0, pin1, points, []);
    entities.push(wire);
    wires.push(wire);
  }

  waitingForParentWire.forEach((wireIndex, pin) => {
    wires[wireIndex].childPins.push(pin);
    pin.parent = wires[wireIndex];
  });

  return entities;
}

function calculateBufferSize(gateTypes: GateTypeEntity[], entities: CanvasEntity[]): number {
  let size = 2; // magic and version

  size += 2; // gate types size
  for (const gateType of gateTypes) {
    if (basicCircuits.find((basicGate) => basicGate.name === gateType.name)) {
      continue;
    }

    size += gateType.name.length + 1; // name
    size += 2; // input and output length
    size += 2; // valuation entries size
    size += (gateType.inputs + gateType.outputs + 2) * Object.entries(gateType.truthTable).length; // valuations
  }

  groupByEntityType(entities, (terminals, wires, gates) => {
    size += 2; // gates size
    for (let i = 0; i < gates.length; i++) {
      size += 2; // index
      size += 2; // x pos
      size += 2; // y pos
    }

    size += 2; // terminals size
    for (const terminal of terminals) {
      size += 1; // flow
      size += terminal.name.length + 1; // name
      size += 2; // x pos
      size += 2; // y pos
      size += 2; // group length
      size += 2 * terminal.group.length; // related terminals
    }

    size += 2; // wires size
    for (const wire of wires) {
      size += 1; // pin0 parent type
      size += 2; // pin0 parent
      size += 1; // pin0 yPos
      size += 1; // pin0 flow
      size += 1; // pin1 parent type
      size += 2; // pin1 parent
      size += 1; // pin1 yPos
      size += 1; // pin1 flow

      if (wire.pin0.parent instanceof WireEntity) {
        size += 2; // x pos
        size += 2; // y pos
      }

      if (wire.pin1.parent instanceof WireEntity) {
        size += 2; // x pos
        size += 2; // y pos
      }

      size += 2; // points size
      for (let i = 0; i < wire.points.length; i++) {
        size += 2; // x pos
        size += 2; // y pos
      }
    }
  });

  return size;
}
