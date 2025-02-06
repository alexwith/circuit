import {
  CenterIcon,
  MoveToolIcon,
  MinusIcon,
  PlusIcon,
  InteractToolIcon,
} from "../../../common/icons";
import { ToolType } from "../../../common/types";
import { useCanvasStore } from "../../../store/canvasStore";
import ControlButton from "./ControlButton";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
};

export default function Control({ onZoomIn, onZoomOut, onCenter }: Props) {
  const tool = useCanvasStore((state) => state.tool);

  const setTool = useCanvasStore((state) => state.setTool);

  const handleToolClick = () => {
    setTool(tool === ToolType.Move ? ToolType.Interact : ToolType.Move);
  };

  return (
    <div className="absolute top-2 left-2 z-20">
      <div className="flex flex-col p-1 gap-1 bg-lightest dark:bg-dark text-gray-400 border-1 border-dark-light dark:border-light-dark rounded-sm">
        <ControlButton icon={<PlusIcon size={20} />} onClick={onZoomIn} />
        <ControlButton icon={<MinusIcon size={20} />} onClick={onZoomOut} />
        <ControlButton icon={<CenterIcon size={20} />} onClick={onCenter} />
        <ControlButton
          icon={
            tool === ToolType.Interact ? <MoveToolIcon size={20} /> : <InteractToolIcon size={20} />
          }
          onClick={handleToolClick}
        />
      </div>
    </div>
  );
}
