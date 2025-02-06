export type Pos = {
  x: number;
  y: number;
};

export enum ToolType {
  Move,
  Interact,
}

export enum Flow {
  In,
  Out,
}

export enum EntityType {
  OutTerminal,
  InTerminal,
}
