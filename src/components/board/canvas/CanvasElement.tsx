import { ReactNode, useRef } from "react";
import useContextMenu from "../../../hooks/useContextMenu";
import CanvasElementContextMenu from "./CanvasElementContextMenu";
import { CanvasEntity } from "../../../entities/canvas/CanvasEntity";
import { Pos } from "../../../common/types";

type Props = {
  entity: CanvasEntity | undefined;
  pos: Pos;
  zIndex: number;
  element: ReactNode;
  onMouseDown?: () => void;
};

export default function CanvasElement({ entity, pos, zIndex, element, onMouseDown }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { handleContextMenu, showContextMenu } = useContextMenu();

  return (
    <div
      ref={ref}
      className="absolute cursor-auto"
      onMouseDown={onMouseDown}
      onContextMenu={handleContextMenu}
      style={{
        zIndex,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {element}
      {entity && (
        <CanvasElementContextMenu show={showContextMenu} entity={entity} />
      )}
    </div>
  );
}
