import { DragEvent, useEffect, useRef } from "react";
import { usePersistentDrag } from "../../../hooks/usePersistentDrag";
import { useCanvasStore } from "../../../store/canvasStore";
import Terminal from "../../logicbuilder/terminal/Terminal";
import TerminalEntity from "../../../entities/TerminalEntity";
import CanvasElement from "./CanvasElement";
import { ToolType } from "../../../common/types";

export default function Canvas() {
  const ref = useRef<SVGSVGElement>(null);

  const zoom = useCanvasStore((state) => state.zoom);
  const tool = useCanvasStore((state) => state.tool);
  const pos = useCanvasStore((state) => state.pos);
  const entities = useCanvasStore((state) => state.entities);
  const addingEntity = useCanvasStore((state) => state.addingEntity);

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
    if (!addingEntity || !ref.current) {
      return;
    }

    const canvasRect = ref.current.getBoundingClientRect();

    const dropX = (event.clientX - canvasRect.left - pos.x) / zoom;
    const dropY = (event.clientY - canvasRect.top - pos.y) / zoom;

    addEntity(new TerminalEntity({ x: dropX, y: dropY }));
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
        <circle cx={1 * zoom} cy={1 * zoom} r={1 * zoom} fill="var(--color-gray-800)" />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#background-dots)" />
      {entities.map((entity) => {
        return (
          <CanvasElement
            pos={entity.pos}
            element={
              <Terminal
                entity={{
                  pos: entity.pos,
                }}
              />
            }
          />
        );
      })}
    </svg>
  );
}
