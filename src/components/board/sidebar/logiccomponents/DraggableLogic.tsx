import ReactDOM from "react-dom/client";
import { DragEvent, ReactNode, useEffect, useState } from "react";
import { useCanvasStore } from "../../../../store/canvasStore";
import { EntityType, Pos } from "../../../../common/types";

type Props = {
  type: EntityType;
  name: string;
  displayElement: ReactNode;
  metadata?: unknown;
};

export default function DraggableLogic({ type, metadata, name, displayElement }: Props) {
  const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null);

  const setComponentDrag = useCanvasStore((actions) => actions.setComponentDrag);

  const handleDragStart = (event: DragEvent) => {
    if (!dragImage) {
      return;
    }

    const rect = dragImage.getBoundingClientRect();
    const offset: Pos = { x: rect.width / 2, y: rect.height / 2 };
    event.dataTransfer.setDragImage(dragImage, offset.x, offset.y);

    setComponentDrag({
      type,
      offset,
      metadata,
    });
  };

  const handleDragEnd = () => {
    setComponentDrag(null);
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
      className="bg-light dark:bg-light-dark px-2 py-[0.15rem] rounded-sm border-1 border-transparent hover:border-1 hover:border-violet-400 hover:cursor-grab"
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
