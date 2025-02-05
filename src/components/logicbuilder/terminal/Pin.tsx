import { Pos } from "../../../common/types";

type Props = {
  offset: Pos;
};

export default function Pin({ offset }: Props) {
  return (
    <div
      className="absolute w-5 h-5 bg-light-dark rounded-full hover:border-2 hover:border-violet-500"
      style={{
        left: `${0.25 * offset.x}rem`,
        top: `${0.25 * offset.y}rem`,
      }}
    />
  );
}
