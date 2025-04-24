import { RefObject, useEffect, useState } from "react";
import { Pos } from "../../../common/types";
import { useCanvasStore } from "../../../store/canvasStore";
import Wire from "./Wire";
import CanvasElement from "../canvas/CanvasElement";

type Props = {
  canvasRef: RefObject<SVGSVGElement | null>;
  startPos: Pos;
  points: Pos[];
  setPoints: (points: Pos[]) => void;
  onCancel: () => void;
};

export default function WiringWire({ canvasRef, startPos, points, setPoints, onCancel }: Props) {
  const [cursorPos, setCursorPos] = useState<Pos>(startPos);

  const canvasPos = useCanvasStore((actions) => actions.pos);
  const zoom = useCanvasStore((actions) => actions.zoom);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    const posFromMouse = (event: MouseEvent): Pos => {
      return {
        x: (event.clientX - canvasRect.left - canvasPos.x) / zoom,
        y: (event.clientY - canvasRect.top - canvasPos.y) / zoom,
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos(posFromMouse(event));
    };

    const handleClick = (event: MouseEvent) => {
      setPoints([...points, posFromMouse(event)]);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [setCursorPos, canvasRef, canvasPos, points, setPoints, zoom]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      onCancel();
    };

    window.addEventListener("keyup", handleEscape);

    return () => {
      window.removeEventListener("keyup", handleEscape);
    };
  }, [onCancel]);

  return (
    <>
      <CanvasElement
        entity={undefined}
        pos={startPos}
        zIndex={-10}
        element={<Wire points={[startPos, ...points, cursorPos]} />}
      />
      <h1
        className="absolute text-dark dark:text-light text-sm font-medium rounded-sm px-1 bg-light dark:bg-dark border-1 border-dark-light dark:border-light-dark"
        style={{
          transform: `translate(${startPos.x - 80}px, ${startPos.y - 45}px)`,
        }}
      >
        Press <span className="font-bold">Esc</span> to stop wiring
      </h1>
    </>
  );
}
