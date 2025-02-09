import { DragEvent, useEffect, useRef } from "react";
import { usePersistentDrag } from "../../../hooks/usePersistentDrag";
import { useCanvasStore } from "../../../store/canvasStore";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { EntityType, Flow, ToolType } from "../../../common/types";
import { isTerminal } from "../../../libs/logicUtil";
import CanvasElements from "./CanvasElements";

export default function Canvas() {
  const ref = useRef<SVGSVGElement>(null);

  const zoom = useCanvasStore((state) => state.zoom);
  const tool = useCanvasStore((state) => state.tool);
  const pos = useCanvasStore((state) => state.pos);
  const pendingEntity = useCanvasStore((state) => state.pendingEntity);

  const zoomToPoint = useCanvasStore((state) => state.zoomToPoint);
  const updatePos = useCanvasStore((state) => state.updatePos);
  const addEntity = useCanvasStore((state) => state.addEntity);

  const { dragging } = usePersistentDrag({ ref, updatePos, enabled: tool === ToolType.Move });

  useEffect(() => {
    const canvas = ref?.current;
    if (!canvas) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();

      zoomToPoint({ x: event.clientX, y: event.clientY }, event.deltaY > 0 ? -0.125 : 0.125);
    };

    canvas.addEventListener("wheel", handleWheel);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [ref, pos, updatePos, zoomToPoint]);

  const handleDrop = (event: DragEvent) => {
    if (pendingEntity === null || !ref.current) {
      return;
    }

    const canvasRect = ref.current.getBoundingClientRect();

    const dropX = (event.clientX - canvasRect.left - pos.x) / zoom;
    const dropY = (event.clientY - canvasRect.top - pos.y) / zoom;

    let entity = null;
    if (isTerminal(pendingEntity.type)) {
      entity = new TerminalEntity(
        { x: dropX, y: dropY },
        pendingEntity.type === EntityType.InTerminal ? Flow.In : Flow.Out,
      );
    }

    if (!entity) {
      return;
    }

    addEntity(entity);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <svg
      ref={ref}
      className="absolute w-full h-full top-0 left-0"
      style={{
        cursor: tool === ToolType.Interact ? "default" : dragging ? "grabbing" : "grab",
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <pattern
        id="background-dots"
        x={pos.x}
        y={pos.y}
        width={25 * zoom}
        height={25 * zoom}
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx={1 * zoom}
          cy={1 * zoom}
          r={1 * zoom}
          className="fill-dark-light dark:fill-light-dark"
        />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#background-dots)" />
      <foreignObject
        className="relative overflow-visible"
        width="100%"
        height="100%"
        transform={`translate(${pos.x}, ${pos.y}) scale(${zoom})`}
      >
        <CanvasElements canvasRef={ref} />
      </foreignObject>
    </svg>
  );
}
