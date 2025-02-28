import { DragEvent, useEffect, useRef } from "react";
import { usePersistentDrag } from "../../../hooks/usePersistentDrag";
import { useCanvasStore } from "../../../store/canvasStore";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { EntityType, Flow, Pos } from "../../../common/types";
import { isTerminal } from "../../../libs/logicUtil";
import CanvasElements from "./CanvasElements";
import { GateEntity } from "../../../entities/canvas/GateEntity";
import { GateTypeEntity } from "../../../entities/other/GateTypeEntity";
import { deserialize } from "../../../libs/circuitFile";
import { dispatchElementChange } from "../../../libs/canvasElementChangeEvent";

export default function Canvas() {
  const ref = useRef<SVGSVGElement | null>(null);
  const draggableRef = useRef<SVGRectElement>(null);
  const elementsRef = useRef<SVGSVGElement>(null);

  const zoom = useCanvasStore((state) => state.zoom);
  const canvasPos = useCanvasStore((state) => state.pos);
  const componentDrag = useCanvasStore((state) => state.componentDrag);

  const zoomToPoint = useCanvasStore((actions) => actions.zoomToPoint);
  const updatePos = useCanvasStore((actions) => actions.updatePos);
  const addEntity = useCanvasStore((actions) => actions.addEntity);
  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);
  const setEntities = useCanvasStore((actions) => actions.setEntities);
  const setGateTypes = useCanvasStore((actions) => actions.setGateTypes);
  const simulate = useCanvasStore((actions) => actions.simulate);

  const { dragging } = usePersistentDrag({
    ref,
    updatePos,
    targetPredicate: (target) => {
      return target === draggableRef.current || target === elementsRef.current;
    },
  });

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
  }, [ref, canvasPos, updatePos, zoomToPoint]);

  const handleDrop = (event: DragEvent) => {
    if (componentDrag === null || !ref.current) {
      return;
    }

    const canvasRect = ref.current.getBoundingClientRect();
    const dropOffset: Pos = componentDrag.offset;

    const pos: Pos = {
      x: (event.clientX - canvasRect.left - canvasPos.x) / zoom - dropOffset.x,
      y: (event.clientY - canvasRect.top - canvasPos.y) / zoom - dropOffset.y,
    };

    let entity = null;
    if (isTerminal(componentDrag.type)) {
      entity = new TerminalEntity(
        pos,
        componentDrag.type === EntityType.InTerminal ? Flow.In : Flow.Out,
      );
    } else if (componentDrag.type === EntityType.Gate) {
      entity = new GateEntity(pos, componentDrag.metadata as GateTypeEntity);
    }

    if (!entity) {
      return;
    }

    addEntity(entity);
    computeTruthTable();
    dispatchElementChange();
  };

  useEffect(() => {
    const dataURI = localStorage.getItem("current-circuit") as string;
    if (!dataURI) {
      return;
    }

    const byteString = atob(dataURI.split(",")[1]);
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      data[i] = byteString.charCodeAt(i);
    }

    const [gateTypes, entities] = deserialize(buffer)!;
    setGateTypes(gateTypes);
    setEntities(entities);
    computeTruthTable();
    simulate();
  }, [setGateTypes, setEntities, simulate, computeTruthTable]);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <svg
      ref={ref}
      className="absolute w-full h-full top-0 left-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <pattern
        id="background-dots"
        x={canvasPos.x}
        y={canvasPos.y}
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
      <rect
        ref={draggableRef}
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="transparent"
        cursor={dragging ? "grabbing" : "grab"}
      />
      <foreignObject
        ref={elementsRef}
        className="relative overflow-visible"
        width="100%"
        height="100%"
        transform={`translate(${canvasPos.x}, ${canvasPos.y}) scale(${zoom})`}
        cursor={dragging ? "grabbing" : "grab"}
      >
        <CanvasElements canvasRef={ref} />
      </foreignObject>
    </svg>
  );
}
