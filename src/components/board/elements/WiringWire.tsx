import { RefObject, useEffect, useState } from "react";
import { Pos } from "../../../common/types";
import { useCanvasStore } from "../../../store/canvasStore";
import Wire from "./Wire";
import CanvasElement from "../canvas/CanvasElement";

type Props = {
  canvasRef: RefObject<SVGSVGElement>;
  startPos: Pos;
  points: Pos[];
  setPoints: (points: Pos[]) => void;
};

export default function WiringWire({ canvasRef, startPos, points, setPoints }: Props) {
  const canvasPos = useCanvasStore((state) => state.pos);
  const zoom = useCanvasStore((state) => state.zoom);

  const [cursorPos, setCursorPos] = useState<Pos>(startPos);

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

  return (
    <CanvasElement
      pos={startPos}
      zIndex={-10}
      element={<Wire points={[startPos, ...points, cursorPos]} />}
    />
  );
}
