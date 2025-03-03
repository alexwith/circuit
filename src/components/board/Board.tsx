import { useEffect, useRef, useState } from "react";
import Canvas from "./canvas/Canvas";
import Control from "./control/Control";
import { useCanvasStore } from "../../store/canvasStore";
import { AUTO_CENTER_STEPS } from "../../common/constants";
import Sidebar from "./sidebar/Sidebar";
import { ExpandIcon } from "../../common/icons";

export default function Board() {
  const boardRef = useRef<HTMLDivElement>(null);

  const [fitContent, setFitContent] = useState<boolean>(false);

  const updatePos = useCanvasStore((actions) => actions.updatePos);
  const updateZoom = useCanvasStore((actions) => actions.updateZoom);
  const zoomToPoint = useCanvasStore((actions) => actions.zoomToPoint);

  useEffect(() => {
    const handleResize = () => {
      if (fitContent && (window.innerWidth < 600 || window.innerHeight < 500)) {
        setFitContent(false);
      }

      if (!fitContent && window.innerWidth > 600 && window.innerHeight > 500) {
        setFitContent(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitContent]);

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

  if (!fitContent) {
    return (
      <div className="bg-lightest dark:bg-dark m-10 p-5 rounded-md border-1 border-dark-light dark:border-light-dark text-center text-dark dark:text-light">
        <h1 className="font-bold text-2xl">Expand your window</h1>
        <div className="flex justify-center py-2 text-">
          <ExpandIcon size={40} className="animate-ping" />
          <ExpandIcon size={40} className="absolute" />
        </div>
        <p>The canvas needs a bit more space to fit.</p>
      </div>
    );
  }

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
