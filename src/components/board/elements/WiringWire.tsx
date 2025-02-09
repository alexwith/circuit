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

export default function WiringWire({ canvasRef, points, setPoints }: Props) {
  const canvasPos = useCanvasStore((state) => state.pos);

  const [cursorPos, setCursorPos] = useState<Pos>(points[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();

    const handleMouseMove = (event: MouseEvent) => {
      setCursorPos({
        x: event.clientX - canvasRect.left - canvasPos.x,
        y: event.clientY - canvasRect.top - canvasPos.y,
      });
    };

    const handleClick = (event: MouseEvent) => {
      setPoints([
        ...points,
        {
          x: event.clientX - canvasRect.left - canvasPos.x,
          y: event.clientY - canvasRect.top - canvasPos.y,
        },
      ]);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [setCursorPos, canvasRef, canvasPos, points, setPoints]);

  return (
    <CanvasElement
      pos={points[0]}
      zIndex={-10}
      element={<Wire points={[...points, cursorPos]} />}
    />
  );
}
