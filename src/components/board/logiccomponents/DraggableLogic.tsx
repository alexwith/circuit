import ReactDOM from "react-dom/client";
import { DragEvent } from "react";
import { useCanvasStore } from "../../../store/canvasStore";
import { TemplateEntity } from "../../../entities/other/TemplateEntity";

type Props = {
  name: string;
  displayElement: JSX.Element;
  template: TemplateEntity;
};

export default function DraggableLogic({ name, displayElement, template }: Props) {
  const setPendingEntity = useCanvasStore((state) => state.setPendingEntity);

  const handleDragStart = (event: DragEvent) => {
    setPendingEntity(template);

    const element: JSX.Element = displayElement;

    const holder = document.createElement("div");
    holder.style.top = "-1000px";
    holder.style.left = "-1000px";
    holder.style.position = "fixed";
    document.body.appendChild(holder);
    event.dataTransfer.setDragImage(holder, 0, 0);

    const root = ReactDOM.createRoot(holder);
    root.render(element);
  };

  const handleDragEnd = () => {
    setPendingEntity(null);
  };

  return (
    <div
      className="bg-light dark:bg-light-dark px-2 py-1 rounded-sm hover:cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h1 className="select-none text-sm dark:text-light">{name}</h1>
    </div>
  );
}
