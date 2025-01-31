import { useRef } from "react";
import Canvas from "./board/Canvas";
import MoveControl from "./board/MoveControl";
import { useCanvasStore } from "../store/canvasStore";
import { AUTO_CENTER_STEPS } from "../common/constants";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const updatePos = useCanvasStore((state) => state.updatePos);
  const zoomToPoint = useCanvasStore((state) => state.zoomToPoint);

  const handleDefaultZoom = (zoom: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    zoomToPoint({ x: rect.width / 2, y: rect.height / 2 }, zoom);
  };

  const handleCenterCanvas = () => {
    const { pos } = useCanvasStore.getState();
    const stepX = -pos.x / AUTO_CENTER_STEPS;
    const stepY = -pos.y / AUTO_CENTER_STEPS;
    let cycles = 0;
    const task = setInterval(() => {
      if (cycles++ === AUTO_CENTER_STEPS) {
        clearInterval(task);
        return;
      }

      updatePos((prev) => ({ x: prev.x + stepX, y: prev.y + stepY }));
    }, 10);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={boardRef}>
      <Canvas />
      <div className="absolute top-10 left-10 z-20">
        <MoveControl
          onZoomIn={() => {
            handleDefaultZoom(0.25);
          }}
          onZoomOut={() => {
            handleDefaultZoom(-0.25);
          }}
          onCenter={handleCenterCanvas}
        />
      </div>
    </div>
  );
}
