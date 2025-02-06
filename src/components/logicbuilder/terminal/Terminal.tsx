import TerminalEntity from "../../../entities/TerminalEntity";
import Pin from "./Pin";

type Props = {
  entity?: TerminalEntity;
};

export default function Terminal({ entity }: Props) {
  return (
    <div className="relative w-19 h-8">
      <div className="absolute border-4 border-dark-light dark:border-light-dark bg-darkest-light dark:bg-dark w-8 h-8 rounded-full"></div>
      <div className="absolute left-7 top-3 w-8 h-2 bg-dark-light dark:bg-light-dark"></div>
      <Pin offset={{ x: 14, y: 1.5 }} />
    </div>
  );
}
