import { PIN_SIZE } from "../../../common/canvasConfig";
import { Pos } from "../../../common/types";

type Props = {
  offset: Pos;
  onClick: () => void;
};

const radius = PIN_SIZE / 2;

export default function Pin({ offset, onClick }: Props) {
  return (
    <circle
      className="fill-dark-light dark:fill-light-dark hover:stroke-violet-500 hover:stroke-2"
      cx={offset.x + radius}
      cy={offset.y + radius}
      r={radius}
      onClick={onClick}
    />
  );
}
