import { TERMINAL_PIN_OFFSET } from "../../../common/canvasConfig";
import { Flow } from "../../../common/types";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import Pin from "./Pin";

type Props = {
  entity?: TerminalEntity;
  flow: Flow;
  onPinClick: (pin: PinEntity) => void;
};

export default function Terminal({ entity, flow, onPinClick }: Props) {
  const handlePinClick = () => {
    if (!entity) {
      return;
    }

    onPinClick(entity.pin);
  };

  return (
    <div className="relative w-19 h-8">
      <div
        className="absolute border-4 border-dark-light dark:border-light-dark bg-darkest-light dark:bg-dark w-8 h-8 rounded-full"
        style={{
          left: `${flow === Flow.In ? 0 : 44}px`,
        }}
      />
      <div
        className="absolute w-8 h-2 bg-dark-light dark:bg-light-dark"
        style={{
          left: `${flow === Flow.In ? 28 : 13}px`,
          top: `${12}px`,
        }}
      />
      <Pin offset={TERMINAL_PIN_OFFSET(flow)} onClick={handlePinClick} />
    </div>
  );
}
