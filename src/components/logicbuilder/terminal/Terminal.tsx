import TerminalEntity from "../../../entities/TerminalEntity";
import Pin from "./Pin";

type Props = {
  entity: TerminalEntity;
};

export default function Terminal({ entity }: Props) {
  return (
    <div>
      <div className="absolute border-4 border-light-dark bg-dark w-8 h-8 rounded-full"></div>
      <div className="absolute left-7 top-3 w-8 h-2 bg-light-dark"></div>
      <Pin offset={{ x: 14, y: 1.5 }} />
    </div>
  );
}
