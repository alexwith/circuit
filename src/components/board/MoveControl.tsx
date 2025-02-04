import {
  CenterIcon,
  MoveToolIcon,
  MinusIcon,
  PlusIcon,
  InteractToolIcon,
} from "../../common/icons";
import { ToolType } from "../../common/types";
import { useCanvasStore } from "../../store/canvasStore";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
};

export default function MoveControl({ onZoomIn, onZoomOut, onCenter }: Props) {
  const tool = useCanvasStore((state) => state.tool);

  const setTool = useCanvasStore((state) => state.setTool);

  const handleToolClick = () => {
    setTool(tool === ToolType.Move ? ToolType.Interact : ToolType.Move);
  };

  return (
    <div className="absolute top-2 left-2 z-20 ">
      <div className="flex flex-col p-1 gap-1 bg-dark text-gray-400 border-1 border-light-dark rounded-sm">
        <div
          className="p-1 hover:bg-light-dark rounded-sm hover:cursor-pointer hover:text-violet-400"
          onClick={onZoomIn}
        >
          <PlusIcon size={20} />
        </div>
        <div
          className="p-1 hover:bg-light-dark rounded-sm hover:cursor-pointer hover:text-violet-400"
          onClick={onZoomOut}
        >
          <MinusIcon size={20} />
        </div>
        <div
          className="p-1 hover:bg-light-dark rounded-sm hover:cursor-pointer hover:text-violet-400"
          onClick={onCenter}
        >
          <CenterIcon size={20} />
        </div>
        <div
          className="p-1 hover:bg-light-dark rounded-sm hover:cursor-pointer hover:text-violet-400"
          onClick={handleToolClick}
        >
          {tool === ToolType.Move ? <MoveToolIcon size={20} /> : <InteractToolIcon size={20} />}
        </div>
      </div>
    </div>
  );
}
