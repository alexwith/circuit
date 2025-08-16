import { useCallback } from "react";
import { CanvasEntity } from "../../../entities/canvas/CanvasEntity";
import { useCanvasStore } from "../../../store/canvasStore";
import { WireEntity } from "../../../entities/canvas/WireEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { GateEntity } from "../../../entities/canvas/GateEntity";
import { PinEntity } from "../../../entities/canvas/PinEntity";

type Props = {
  show: boolean;
  entity: CanvasEntity;
  handleRenameClick: () => void;
};

export default function CanvasElementContextMenu({ show, entity, handleRenameClick }: Props) {  
  const entities = useCanvasStore((state) => state.entities);
  const zoom = useCanvasStore((state) => state.zoom);

  const removeEntity = useCanvasStore((actions) => actions.removeEntity);

  const handleDeleteClick = useCallback(() => {
    if (entity instanceof TerminalEntity || entity instanceof GateEntity) {
      const pins: PinEntity[] = [];
      if (entity instanceof GateEntity) {
        pins.push(...entity.inputs);
        pins.push(...entity.outputs);
      }
      if (entity instanceof TerminalEntity) {
        pins.push(entity.pin);
      }

      for (const otherEntity of entities) {
        if (otherEntity instanceof WireEntity) {
          if (pins.includes(otherEntity.pin0) || pins.includes(otherEntity.pin1)) {
            removeEntity(otherEntity);
          }
        }

        if (entity instanceof TerminalEntity && otherEntity instanceof TerminalEntity) {
          const index = otherEntity.group.indexOf(entity);
          if (index != -1) {
            otherEntity.group.splice(index, 1);
          }
        }
      }
    }

    removeEntity(entity);
  }, [entity, entities]);

  if (!show) {
    return null;
  }

  let name;
  if (entity instanceof GateEntity) {
    name = entity.type.name;
  } else if (entity instanceof WireEntity) {
    name = "Wire";
  } else if (entity instanceof TerminalEntity) {
    name = "Terminal";
  }

  const canRename = entity instanceof TerminalEntity;

  return (
    <>
      <g transform={`translate(80, 0) scale(${1 / zoom})`}>
        <rect
          className="fill-dark stroke-violet-500"
          x={0}
          y={0}
          rx={6}
          width={140}
          height={canRename ? 100 : 70}
          strokeWidth={1}
        />
        <text
          className="fill-dark-light font-bold"
          x={70}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {name}
        </text>
        <g
          onClick={() => {
            handleDeleteClick();
          }}
          style={{ cursor: "pointer" as any }}
        >
          <rect
            className="fill-light-dark hover:stroke-violet-500"
            x={10}
            y={32}
            rx={4}
            width={120}
            height={25}
          />
          <text
            className="font-medium fill-dark-light pointer-events-none"
            x={70}
            y={38}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            Delete
          </text>
        </g>
        {canRename && (
          <g
            onClick={() => {
              handleRenameClick();
            }}
            style={{ cursor: "pointer" as any }}
          >
            <rect
              className="fill-light-dark hover:stroke-violet-500"
              x={10}
              y={64}
              rx={4}
              width={120}
              height={25}
            />
            <text
              className="font-medium fill-dark-light pointer-events-none"
              x={70}
              y={70}
              textAnchor="middle"
              dominantBaseline="hanging"
            >
              Rename
            </text>
          </g>
        )}
      </g>      
    </>
  );
}
