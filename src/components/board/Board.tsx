import { useRef } from "react";
import Canvas from "./canvas/Canvas";
import Control from "./control/Control";
import { useCanvasStore } from "../../store/canvasStore";
import { AUTO_CENTER_STEPS } from "../../common/constants";
import LogicComponents from "./logiccomponents/LogicComponents";

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
      <div className="absolute w-50 top-2 right-2 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm hover:border-violet-400 hover:cursor-pointer">
        <div className="flex items-center gap-1 px-3 py-1">
          <h1 className="font-medium text-sm text-dark dark:text-light">Create Circuit</h1>
        </div>
      </div>
      <LogicComponents />
    </div>
  );
}
