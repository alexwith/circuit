import ReactDOM from "react-dom/client";
import { DragEvent } from "react";
import { EntityType } from "../../entities/entityType";
import { useCanvasStore } from "../../store/canvasStore";
import Terminal from "./terminal/Terminal";

type Props = {
  name: string;
};

export default function DraggableLogic({ name }: Props) {
  const setAddingEntity = useCanvasStore((state) => state.setAddingEntity);

  const handleDragStart = (event: DragEvent) => {
    setAddingEntity(EntityType.InTerminal);

    const image: JSX.Element = <Terminal />;

    const ghost = document.createElement("div");
    ghost.style.top = "-1000px";
    ghost.style.left = "-1000px";
    ghost.style.position = "fixed";
    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, 0, 0);

    const root = ReactDOM.createRoot(ghost);
    root.render(image);
  };

  return (
    <div
      className="bg-light dark:bg-light-dark px-2 py-1 rounded-sm hover:cursor-grab"
      draggable
      onDragStart={handleDragStart}
    >
      <h1 className="select-none text-sm dark:text-light">{name}</h1>
    </div>
  );
}
