import { TERMINAL_PIN_OFFSET } from "../../../common/canvasConfig";
import { Flow } from "../../../common/types";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import Pin from "./Pin";
import { useCanvasStore } from "../../../store/canvasStore";
import DynamicInput from "../../common/DynamicInput";
import { dispatchElementChange } from "../../../libs/canvasElementChangeEvent";

type Props = {
  flow: Flow;
  entity?: TerminalEntity;
  onPinClick?: (pin: PinEntity) => void;
};

export default function Terminal({ flow, entity, onPinClick }: Props) {
  const simulate = useCanvasStore((actions) => actions.simulate);
  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);

  const handlePinClick = () => {
    if (!entity || !onPinClick) {
      return;
    }

    onPinClick(entity.pin);
  };

  const handleTerminalClick = () => {
    // You can only manually activate input terminals
    if (flow !== Flow.In || !entity) {
      return;
    }

    entity.pin.active = !entity.pin.active;
    simulate();
  };

  const handleNameChange = (name: string) => {
    if (!entity) {
      return;
    }

    entity.name = name;
    computeTruthTable();
    dispatchElementChange();
  };

  return (
    <div className="relative w-18 h-8">
      <div
        className="absolute z-10 border-4 border-dark-light dark:border-light-dark bg-darkest-light dark:bg-dark w-8 h-8 rounded-full hover:border-violet-500"
        style={{
          left: `${flow === Flow.In ? 0 : 44}px`,
          background: entity?.pin.active ? "var(--color-red-500)" : "",
        }}
        onClick={handleTerminalClick}
      />
      <div
        className="absolute w-8 h-2 bg-dark-light dark:bg-light-dark"
        style={{
          left: `${flow === Flow.In ? 28 : 13}px`,
          top: `${12}px`,
        }}
      />
      <Pin offset={TERMINAL_PIN_OFFSET(flow)} onClick={handlePinClick} />
      <div
        className="absolute z-20"
        style={{
          left: flow === Flow.In ? "75px" : "",
          right: flow === Flow.Out ? "75px" : "",
          top: `${5}px`,
          display: entity ? "block" : "none",
        }}
      >
        <DynamicInput
          enabled={entity !== undefined}
          className="select-none text-dark dark:text-light text-sm font-medium rounded-sm px-1 bg-light dark:bg-dark border-1 border-dark-light dark:border-light-dark"
          defaultValue={entity?.name || ""}
          onChange={handleNameChange}
          maxLength={10}
        />
      </div>
    </div>
  );
}
