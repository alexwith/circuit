import { ReactNode, useRef } from "react";
import { Pos } from "../../../common/types";

type Props = {
  pos: Pos;
  zIndex: number;
  element: ReactNode;
  onMouseDown?: () => void;
};

export default function CanvasElement({ pos, zIndex, element, onMouseDown }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="absolute"
      onMouseDown={onMouseDown}
      style={{
        zIndex,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {element}
    </div>
  );
}
