import { DragEvent, ReactNode, useEffect } from "react";
import { useCanvasStore } from "../../../../store/canvasStore";
import { EntityType, Pos } from "../../../../common/types";

type Props = {
  type: EntityType;
  name: string;
  displayElement: ReactNode;
  metadata?: unknown;
};

export default function DraggableLogic({ type, metadata, name, displayElement }: Props) {
  //const [dragImage, setDragImage] = useState<HTMLDivElement | null>(null);

  //const zoom = useCanvasStore((state) => state.zoom);

  const setComponentDrag = useCanvasStore((actions) => actions.setComponentDrag);

  const handleDragStart = (_: DragEvent) => {
    // if (!dragImage) {
    //   return;
    // }

    // const rect = dragImage.getBoundingClientRect();
    // const offset: Pos = { x: rect.width / 2, y: rect.height / 2 };
    // event.dataTransfer.setDragImage(dragImage, offset.x, offset.y);
    const offset: Pos = { x: 0, y: 0};

    setComponentDrag({
      type,
      offset,
      metadata,
    });
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
    // const dragImage = document.createElement("div");
    // dragImage.style.top = "-9999px";
    // dragImage.style.left = "-9999px";
    // dragImage.style.position = "fixed";
    // document.body.appendChild(dragImage);

    // setDragImage(dragImage);
  }, [displayElement]);

  /*useEffect(() => {
    // Create a temp container for measuring
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    document.body.appendChild(tempContainer);

    // Render into it
    const tempRoot = ReactDOM.createRoot(tempContainer);
    tempRoot.render(
      <svg>
        <g id="measure-group" transform={`scale(${zoom})`}>{displayElement}</g>
      </svg>
    );

    // Make sure it's been painted, then measure
    requestAnimationFrame(() => {
      const measureGroup = tempContainer.querySelector<SVGGElement>("#measure-group");
      if (!measureGroup) {
        return;
      }

      const bounds = measureGroup.getBBox();
      
      tempRoot.unmount();
      document.body.removeChild(tempContainer);

      // Build drag image
      const dragImage = document.createElement("div");
      dragImage.style.top = "-9999px";
      dragImage.style.left = "-9999px";
      dragImage.style.position = "fixed";
      document.body.appendChild(dragImage);

      const padding = 4;
      const viewBox = `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${
        bounds.height + padding * 2
      }`;
      const width = bounds.width + padding * 2;
      const height = bounds.height + padding * 2;

      const dragRoot = ReactDOM.createRoot(dragImage);
      dragRoot.render(
        <svg
          width={width}
          height={height}
          viewBox={viewBox}
          overflow="visible"
          style={{ display: "block" }}
        >
          <g transform={`scale(${zoom})`}>{displayElement}</g>
        </svg>
      );

      setDragImage(dragImage);
    });

    return () => {};
  }, [displayElement, zoom]);*/

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
