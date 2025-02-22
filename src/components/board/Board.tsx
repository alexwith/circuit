import { useRef } from "react";
import Canvas from "./canvas/Canvas";
import Control from "./control/Control";
import { useCanvasStore } from "../../store/canvasStore";
import { AUTO_CENTER_STEPS } from "../../common/constants";
import Sidebar from "./sidebar/Sidebar";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const updatePos = useCanvasStore((state) => state.updatePos);
  const updateZoom = useCanvasStore((state) => state.updateZoom);
  const zoomToPoint = useCanvasStore((state) => state.zoomToPoint);

  const handleDefaultZoom = (zoom: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    zoomToPoint({ x: rect.width / 2, y: rect.height / 2 }, zoom);
  };

  const handleCenterCanvas = () => {
    const { pos, zoom } = useCanvasStore.getState();
    const stepX = -pos.x / AUTO_CENTER_STEPS;
    const stepY = -pos.y / AUTO_CENTER_STEPS;
    const zoomStep = (1 - zoom) / AUTO_CENTER_STEPS;
    let cycles = 0;
    const task = setInterval(() => {
      if (cycles++ === AUTO_CENTER_STEPS) {
        clearInterval(task);
        return;
      }

      updatePos((prev) => ({ x: prev.x + stepX, y: prev.y + stepY }));
      updateZoom((prev) => prev + zoomStep);
    }, 10);
  };

  return (
    <div className="relative flex-grow w-full h-full overflow-hidden" ref={boardRef}>
      <Canvas />
      <Control
        onZoomIn={() => {
          handleDefaultZoom(0.25);
        }}
        onZoomOut={() => {
          handleDefaultZoom(-0.25);
        }}
        onCenter={handleCenterCanvas}
      />
      <Sidebar />
    </div>
  );
}
