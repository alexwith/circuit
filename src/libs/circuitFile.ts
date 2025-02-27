import { Buffer } from "buffer";
import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import OffsetBuffer from "./OffsetBuffer";
import { groupByEntityType } from "./entityUtil";
import { createGateTypeEntity, GateTypeEntity } from "../entities/other/GateTypeEntity";
import { TerminalEntity } from "../entities/canvas/TerminalEntity";
import { GateEntity } from "../entities/canvas/GateEntity";
import { WireEntity } from "../entities/canvas/WireEntity";
import { Flow, Pos } from "../common/types";
import { basicLogicGates } from "../common/basicGates";

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

2 bytes - wires size
    2 byte - pin0 parent index
    1 byte - pin0 pin index
    1 byte - pin0 flow
    2 byte - pin1 parent index
    1 byte - pin1 pin index
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

  buffer.writeUInt16(gateTypes.length - basicLogicGates.length);
  for (const gateType of gateTypes) {
    if (basicLogicGates.find((basicGate) => basicGate.name === gateType.name)) {
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
  gateTypes.push(...basicLogicGates);

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
  entities: CanvasEntity[],
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

    buffer.writeUInt16(wires.length);
    for (const wire of wires) {
      const parent0 = wire.pin0.parent;
      buffer.writeUInt16(processedEntities.indexOf(parent0));
      buffer.writeUInt8(wire.pin0.yPos);
      buffer.writeUInt8(wire.pin0.flow);

      const parent1 = wire.pin1.parent;
      buffer.writeUInt16(processedEntities.indexOf(parent1));
      buffer.writeUInt8(wire.pin1.yPos);
      buffer.writeUInt8(wire.pin1.flow);

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
    entities.push(new TerminalEntity(pos, flow, name));
  }

  const wiresSize = buffer.readUInt16();
  for (let i = 0; i < wiresSize; i++) {
    const pin0Parent = entities[buffer.readUInt16()];
    const pin0YPos = buffer.readUInt8();
    const pin0Flow = buffer.readUInt8();

    const pin1Parent = entities[buffer.readUInt16()];
    const pin1YPos = buffer.readUInt8();
    const pin1Flow = buffer.readUInt8();

    let pin0 = null;
    if (pin0Parent instanceof TerminalEntity) {
      pin0 = pin0Parent.pin;
    } else if (pin0Parent instanceof GateEntity) {
      pin0 = pin0Flow === Flow.In ? pin0Parent.inputs[pin0YPos] : pin0Parent.outputs[pin0YPos];
    }

    let pin1 = null;
    if (pin1Parent instanceof TerminalEntity) {
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
    entities.push(new WireEntity(pin0, pin1, points));
  }

  return entities;
}

function calculateBufferSize(gateTypes: GateTypeEntity[], entities: CanvasEntity[]): number {
  let size = 2; // magic and version

  size += 2; // gate types size
  for (const gateType of gateTypes) {
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
    }

    size += 2; // wires size
    for (const wire of wires) {
      size += 4; // pin0
      size += 4; // pin1
      size += 2; // points size
      for (let i = 0; i < wire.points.length; i++) {
        size += 2; // x pos
        size += 2; // y pos
      }
    }
  });

  return size;
}
