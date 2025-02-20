import { create } from "zustand";
import { ComponentDrag, Pos } from "../common/types";
import { MAX_ZOOM, MIN_ZOOM } from "../common/constants";
import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import { GateTypeEntity } from "../entities/other/GateTypeEntity";
import { basicLogicGates } from "../common/basicGates";
import { executeCircuit } from "../libs/circuit";
import { groupByEntityType } from "../libs/entityUtil";
import { computeTruthTable } from "../libs/truthTable";

type State = {
  pos: Pos;
  zoom: number;
  entities: CanvasEntity[];
  gateTypes: GateTypeEntity[];
  truthTable: boolean[][];
  componentDrag: ComponentDrag | null;
};

type Actions = {
  updatePos: (modifier: (prev: Pos) => Pos) => void;
  updateZoom: (modifier: (prev: number) => number) => void;
  zoomToPoint: (target: Pos, zoom: number) => void;
  addEntity: (entity: CanvasEntity) => void;
  addGateType: (gateType: GateTypeEntity) => void;
  setComponentDrag: (componentDrag: ComponentDrag | null) => void;
  computeTruthTable: () => void;
  simulate: () => void;
};

export const useCanvasStore = create<State & Actions>((set) => ({
  pos: { x: 0, y: 0 },
  zoom: 1,
  entities: [],
  gateTypes: basicLogicGates,
  truthTable: [],
  componentDrag: null,

  updatePos: (modifier: (prev: Pos) => Pos) =>
    set((state) => ({
      pos: modifier(state.pos),
    })),
  updateZoom: (modifier: (prev: number) => number) =>
    set((state) => ({
      zoom: modifier(state.zoom),
    })),
  zoomToPoint: (target: Pos, zoom: number) =>
    set((state) => {
      const prevZoom = state.zoom;
      const clampedZoom = Math.min(Math.max(prevZoom + zoom, MIN_ZOOM), MAX_ZOOM);
      if (prevZoom === clampedZoom) {
        return {};
      }

      const mouseX = (target.x - state.pos.x) / prevZoom;
      const mouseY = (target.y - state.pos.y) / prevZoom;

      const x = target.x - mouseX * clampedZoom;
      const y = target.y - mouseY * clampedZoom;

      return {
        zoom: clampedZoom,
        pos: { x, y },
      };
    }),
  addEntity: (entity: CanvasEntity) =>
    set((state) => {
      return {
        entities: [...state.entities, entity],
      };
    }),
  addGateType: (gateType: GateTypeEntity) =>
    set((state) => {
      return { gateTypes: [...state.gateTypes, gateType] };
    }),
  setComponentDrag: (componentDrag: ComponentDrag | null) =>
    set(() => ({
      componentDrag,
    })),
  computeTruthTable: () => {
    set((state) => ({
      truthTable: groupByEntityType(state.entities, (terminals, wires, gates) => {
        return computeTruthTable(terminals, wires, gates);
      }),
    }));
  },
  simulate: () => {
    set((state) => {
      groupByEntityType(state.entities, (terminals, wires, gates) => {
        executeCircuit(terminals, wires, gates);
      });

      // trigger a canvas refresh
      state.pos = {
        x: state.pos.x,
        y: state.pos.y,
      };

      return {};
    });
  },
}));
