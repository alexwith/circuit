import { EntityType } from "../../entities/entityType";
import { useCanvasStore } from "../../store/canvasStore";

type Props = {
  name: string;
};

export default function DraggableLogic({ name }: Props) {
  const setAddingEntity = useCanvasStore((state) => state.setAddingEntity);

  const handleDragStart = () => {
    setAddingEntity(EntityType.InTerminal);
  };

  return (
    <div
      className="bg-light-dark px-2 py-1 rounded-sm text-violet-400 hover:cursor-grab"
      draggable
      onDragStart={handleDragStart}
    >
      <h1>{name}</h1>
    </div>
  );
}
