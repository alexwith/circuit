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
  const ref = useRef<SVGGElement>(null);
  const { handleContextMenu, showContextMenu } = useContextMenu();

  return (
    <g
      ref={ref}
      transform={`translate(${pos.x}, ${pos.y})`}
      style={{ cursor: "auto" as any }}
      onMouseDown={onMouseDown as any}
      onContextMenu={handleContextMenu as any}
      data-zindex={zIndex}
    >
      {element}
      {entity && (
        <CanvasElementContextMenu show={showContextMenu} entity={entity} />
      )}
    </g>
  );
}
