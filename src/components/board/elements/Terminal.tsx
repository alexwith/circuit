import { useState } from "react";
import { TERMINAL_PIN_OFFSET } from "../../../common/canvasConfig";
import { Flow } from "../../../common/types";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import Pin from "./Pin";
import { useCanvasStore } from "../../../store/canvasStore";
import DynamicInput from "../../common/DynamicInput";

type Props = {
  flow: Flow;
  entity?: TerminalEntity;
  onPinClick?: (pin: PinEntity) => void;
};

export default function Terminal({ flow, entity, onPinClick }: Props) {
  const [active, setActive] = useState<boolean>(false);

  const simulate = useCanvasStore((store) => store.simulate);
  const computeTruthTable = useCanvasStore((store) => store.computeTruthTable);

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

    entity.pin.active = !active;
    setActive(!active);
    simulate();
  };

  const handleNameChange = (name: string) => {
    if (!entity) {
      return;
    }

    entity.name = name;
    computeTruthTable();
  };

  return (
    <div className="relative w-18 h-8">
      <div
        className="absolute z-10 border-4 border-dark-light dark:border-light-dark bg-darkest-light dark:bg-dark w-8 h-8 rounded-full hover:border-violet-500"
        style={{
          left: `${flow === Flow.In ? 0 : 44}px`,
          background: active ? "var(--color-red-500)" : "",
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
          left: `${flow === Flow.In ? 75 : -37}px`,
          top: `${5}px`,
          display: entity ? "block" : "none",
        }}
      >
        <DynamicInput
          enabled={entity !== undefined}
          className="opacity-80 text-light text-sm font-medium rounded-sm px-1 bg-dark border-1 border-light-dark"
          defaultValue={entity?.name || ""}
          onChange={handleNameChange}
          maxLength={10}
        />
      </div>
    </div>
  );
}
