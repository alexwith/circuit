import { create } from "zustand";
import { Pos, ToolType } from "../common/types";
import { MAX_ZOOM, MIN_ZOOM } from "../common/constants";
import { CanvasEntity } from "../entities/canvas/CanvasEntity";
import { TemplateEntity } from "../entities/other/TemplateEntity";

type State = {
  pos: Pos;
  zoom: number;
  tool: ToolType;
  entities: CanvasEntity[];
  pendingEntity: TemplateEntity | null;
};

type Actions = {
  updatePos: (modifier: (prev: Pos) => Pos) => void;
  updateZoom: (modifier: (prev: number) => number) => void;
  zoomToPoint: (target: Pos, zoom: number) => void;
  setTool: (tool: ToolType) => void;
  addEntity: (entity: CanvasEntity) => void;
  setPendingEntity: (entity: TemplateEntity | null) => void;
};

export const useCanvasStore = create<State & Actions>((set) => ({
  pos: { x: 0, y: 0 },
  zoom: 1,
  tool: ToolType.Move,
  entities: [],
  pendingEntity: null,

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
  setTool: (tool: ToolType) => set(() => ({ tool })),
  addEntity: (entity: CanvasEntity) =>
    set((state) => {
      return {
        entities: [...state.entities, entity],
      };
    }),
  setPendingEntity: (entity: TemplateEntity | null) =>
    set(() => ({
      pendingEntity: entity,
    })),
}));
