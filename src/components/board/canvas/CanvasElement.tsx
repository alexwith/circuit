import { ReactNode } from "react";
import { Pos } from "../../../common/types";
import { useCanvasStore } from "../../../store/canvasStore";

type Props = {
  pos: Pos;
  element: ReactNode;
};

export default function CanvasElement({ pos, element }: Props) {
  const zoom = useCanvasStore((state) => state.zoom);
  const canvasPos = useCanvasStore((state) => state.pos);

  return (
    <foreignObject
      width="100%"
      height="100%"
      transform={`translate(${pos.x * zoom + canvasPos.x}, ${pos.y * zoom + canvasPos.y}) scale(${zoom})`}
    >
      {element}
    </foreignObject>
  );
}
