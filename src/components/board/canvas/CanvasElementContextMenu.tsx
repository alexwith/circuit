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
};

export default function CanvasElementContextMenu({ show, entity }: Props) {
  const entities = useCanvasStore((state) => state.entities);

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

  return (
    <div className="absolute bg-dark text-dark-light rounded-md flex flex-col overflow-hidden text-center p-2 border-1 border-violet-500 w-30">
      <h1 className="font-bold text-center mb-2">{name}</h1>
      <div
        className="rounded-md font-medium w-full border-1 border-transparent bg-light-dark hover:border-violet-500 hover:cursor-pointer"
        onClick={() => {
          handleDeleteClick();
        }}
      >
        Delete
      </div>
    </div>
  );
}
