import { useEffect, useRef } from "react";
import { usePersistentDrag } from "../../hooks/usePersistentDrag";
import { useCanvasStore } from "../../store/canvasStore";

export default function Canvas() {
  const ref = useRef<SVGSVGElement>(null);

  const zoom = useCanvasStore((state) => state.zoom);
  const pos = useCanvasStore((state) => state.pos);

  const zoomToPoint = useCanvasStore((state) => state.zoomToPoint);
  const updatePos = useCanvasStore((state) => state.updatePos);

  const { dragging } = usePersistentDrag({ ref, updatePos });

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

  return (
    <svg
      ref={ref}
      className="absolute w-full h-full top-0 left-0"
      style={{
        cursor: dragging ? "grabbing" : "grab",
      }}
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
      <g transform={`translate(${pos.x}, ${pos.y}) scale(${zoom})`}>
        <foreignObject width="100%" height="100%">
          <div className="absolute bg-gray-500 w-44 h-44 top-20 left-40"></div>
          <div className="absolute bg-gray-500 w-44 h-44 top-100 left-100"></div>
        </foreignObject>
      </g>
    </svg>
  );
}
