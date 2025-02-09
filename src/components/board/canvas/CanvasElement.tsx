import { ReactNode } from "react";
import { Pos } from "../../../common/types";

type Props = {
  pos: Pos;
  zIndex: number;
  element: ReactNode;
};

export default function CanvasElement({ pos, zIndex, element }: Props) {
  return (
    <div
      className="absolute"
      style={{
        zIndex,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {element}
    </div>
  );
}
