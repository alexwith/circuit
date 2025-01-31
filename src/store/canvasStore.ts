import { create } from "zustand";
import { Pos } from "../common/types";
import { MAX_ZOOM, MIN_ZOOM } from "../common/constants";

type State = {
  pos: Pos;
  zoom: number;
};

type Actions = {
  updatePos: (modifier: (prev: Pos) => Pos) => void;
  zoomToPoint: (target: Pos, zoom: number) => void;
};

export const useCanvasStore = create<State & Actions>((set) => ({
  pos: { x: 0, y: 0 },
  zoom: 1,

  updatePos: (modifier: (prev: Pos) => Pos) =>
    set((state) => ({
      pos: modifier(state.pos),
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
}));
