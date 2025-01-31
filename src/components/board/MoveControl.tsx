import { CenterIcon, MinusIcon, PlusIcon } from "../../common/icons";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
};

export default function MoveControl({ onZoomIn, onZoomOut, onCenter }: Props) {
  return (
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
    </div>
  );
}
