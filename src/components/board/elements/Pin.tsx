import { PIN_SIZE } from "../../../common/canvasConfig";
import { Pos } from "../../../common/types";

type Props = {
  offset: Pos;
  onClick: () => void;
};

export default function Pin({ offset, onClick }: Props) {
  return (
    <div
      className="absolute bg-dark-light dark:bg-light-dark rounded-full hover:border-2 hover:border-violet-500"
      style={{
        width: `${PIN_SIZE}px`,
        height: `${PIN_SIZE}px`,
        left: `${offset.x}px`,
        top: `${offset.y}px`,
      }}
      onClick={onClick}
    />
  );
}
