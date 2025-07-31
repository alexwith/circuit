export type Pos = {
  x: number;
  y: number;
};

export type ComponentDrag = {
  type: EntityType;
  offset: Pos;
  metadata: unknown;
};

export enum Flow {
  In,
  Out,
}

export enum EntityType {
  OutTerminal,
  InTerminal,
  Gate,
  Wire
}
