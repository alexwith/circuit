export class GateTypeEntity {
  name: string;
  inputs: number;
  outputs: number;

  constructor(name: string, inputs: number, outputs: number) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
  }
}
