import { DragEvent, ReactNode, useEffect, useState } from "react";
import { useCanvasStore } from "../../../../store/canvasStore";
import { EntityType} from "../../../../common/types";
import ReactDOM from "react-dom/client";

type Props = {
  type: EntityType;
  name: string;
  displayElement: ReactNode;
  metadata?: unknown;
};

export default function DraggableLogic({ type, metadata, name, displayElement }: Props) {
  const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null);

  const zoom = useCanvasStore((state) => state.zoom);

  const setComponentDrag = useCanvasStore((actions) => actions.setComponentDrag);

  const handleDragStart = (event: DragEvent) => {
    if (!dragImage) {
      return;
    }

    event.dataTransfer.setDragImage(dragImage, 150 * zoom, 0);

    setComponentDrag({ type, metadata });
  };

  const handleDragEnd = () => {
    setComponentDrag(null);
  };

  /*
  The following logic is a bit all over the place and does
  a lot of tricky things to be able to render an SVG
  with overflows as the drag image
  */
  useEffect(() => {
    const dragImage = document.createElement("div");
    dragImage.style.top = "-9999px";
    dragImage.style.left = "-9999px";
    dragImage.style.position = "fixed";
    document.body.appendChild(dragImage);

    const zoomedDisplayElement = (
      <svg
        className="absolute origin-center"                
        overflow="visible"
        width={600 * zoom}
        height={600 * zoom}
        viewBox="-100 0 500 600"
      >        
        {displayElement}        
      </svg>
    );

    const root = ReactDOM.createRoot(dragImage);
    root.render(zoomedDisplayElement);

    setDragImage(dragImage);

    return () => dragImage.remove();
  }, [displayElement, zoom]);

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
