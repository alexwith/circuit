import { Pos } from "../../../common/types";

type Props = {
  offset: Pos;
};

export default function Pin({ offset }: Props) {
  return (
    <div
      className="absolute w-5 h-5 bg-dark-light dark:bg-light-dark rounded-full hover:border-2 hover:border-violet-500"
      style={{
        left: `${offset.x}px`,
        top: `${offset.y}px`,
      }}
    />
  );
}
