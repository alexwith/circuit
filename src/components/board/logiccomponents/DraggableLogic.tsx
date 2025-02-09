import ReactDOM from "react-dom/client";
import { DragEvent, useEffect, useState } from "react";
import { useCanvasStore } from "../../../store/canvasStore";
import { TemplateEntity } from "../../../entities/other/TemplateEntity";
import { Pos } from "../../../common/types";

type Props = {
  name: string;
  displayElement: JSX.Element;
  template: TemplateEntity;
};

export default function DraggableLogic({ name, displayElement, template }: Props) {
  const setPendingEntity = useCanvasStore((state) => state.setPendingEntity);

  const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null);

  const handleDragStart = (event: DragEvent) => {
    setPendingEntity(template);

    if (!dragImage) {
      return;
    }

    const rect = dragImage.getBoundingClientRect();
    const offset: Pos = { x: rect.width / 2, y: rect.height / 2 };
    event.dataTransfer.setData("offset", JSON.stringify(offset));
    event.dataTransfer.setDragImage(dragImage, offset.x, offset.y);
  };

  const handleDragEnd = () => {
    setPendingEntity(null);
  };

  useEffect(() => {
    const dragImage = document.createElement("div");
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.position = "fixed";
    document.body.appendChild(dragImage);

    const root = ReactDOM.createRoot(dragImage);
    root.render(displayElement);

    setDragImage(dragImage);

    return () => dragImage.remove();
  }, [displayElement]);

  return (
    <div
      className="bg-light dark:bg-light-dark px-2 py-1 rounded-sm border-1 border-transparent hover:border-1 hover:border-violet-400 hover:cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h1 className="select-none font-medium text-sm text-lightest-dark dark:text-dark-light">
        {name}
      </h1>
    </div>
  );
}
