import { ReactNode } from "react";
import { Pos } from "../../../common/types";

type Props = {
  pos: Pos;
  element: ReactNode;
};

export default function CanvasElement({ pos, element }: Props) {
  return (
    <div
      className={`absolute z-20`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {element}
    </div>
  );
}
