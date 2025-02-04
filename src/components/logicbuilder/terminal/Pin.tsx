import { Pos } from "../../../common/types";

type Props = {
  offset: Pos;
};

export default function Pin({ offset }: Props) {
  return (
    <div
      className={`absolute left-${offset.x} top-${offset.y} w-5 h-5 bg-light-dark rounded-full hover:border-2 hover:border-violet-500`}
    />
  );
}
