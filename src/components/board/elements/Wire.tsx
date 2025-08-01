import { MouseEvent, RefObject, useMemo } from "react";
import { Flow, Pos } from "../../../common/types";
import { WireEntity } from "../../../entities/canvas/WireEntity";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { useCanvasStore } from "../../../store/canvasStore";
import { smoothSVGPath } from "../../../libs/pathUtil";

type Props = {
  canvasRef: RefObject<SVGSVGElement | null>;
  entity?: WireEntity;
  points: Pos[];
  isComplete: boolean;
  onNewPinClick: (pin: PinEntity) => void;
};

export default function Wire({ canvasRef, entity, points, isComplete, onNewPinClick }: Props) {
  const canvasPos = useCanvasStore((state) => state.pos);
  const zoom = useCanvasStore((state) => state.zoom);

  const path = useMemo(() => {
    return smoothSVGPath(points, 7);
  }, [points]);

  const handleWireClick = (event: MouseEvent) => {
    if (!entity || !canvasRef.current) {
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const pos: Pos = {
      x: (event.clientX - canvasRect.left - canvasPos.x) / zoom,
      y: (event.clientY - canvasRect.top - canvasPos.y) / zoom
    };
     
    const pin = new PinEntity(entity, Flow.In, 0, pos);
    entity.childPins.push(pin);
    onNewPinClick(pin);    
  };

  return (
    <svg className="overflow-visible w-[1px] h-[1px]">
      <path
        className="stroke-4 stroke-dark-light dark:stroke-light-dark hover:stroke-7"
        fill="none"
        d={path}
        style={{        
          stroke: entity?.isActive() ? "var(--color-red-500)" : "",
          pointerEvents: isComplete ? "auto" : "none"
        }}
        onClick={handleWireClick}
      />
    </svg>
  );
}