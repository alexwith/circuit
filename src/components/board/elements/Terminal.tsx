import { TERMINAL_PIN_OFFSET } from "../../../common/canvasConfig";
import { Flow } from "../../../common/types";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import Pin from "./Pin";
import { useCanvasStore } from "../../../store/canvasStore";

type Props = {
  flow: Flow;
  entity?: TerminalEntity;
  onPinClick?: (pin: PinEntity) => void;
};

export default function Terminal({ flow, entity, onPinClick }: Props) {
  const simulate = useCanvasStore((actions) => actions.simulate);  

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

  return (
    <g>      
      <rect
        className="fill-dark-light dark:fill-light-dark"
        x={flow === Flow.In ? 30 : 13}
        y={12}
        width={28}
        height={8}
      />
      <Pin offset={TERMINAL_PIN_OFFSET(flow)} onClick={handlePinClick} />
      {entity && (
        <text
          className="fill-dark dark:fill-light text-normal font-medium select-none"
          x={flow === Flow.In ? 75 : -5}
          y={20}
          textAnchor={flow === Flow.In ? "start" : "end"}     
        >
          {entity?.name}
        </text>
      )}
      <circle
        className="fill-darkest-light dark:fill-dark stroke-4 stroke-dark-light dark:stroke-light-dark hover:stroke-violet-500"
        cx={flow === Flow.In ? 16 : 56}
        cy={16}
        r={14}
        style={{ fill: entity?.pin.active ? "var(--color-red-500)" : undefined }}
        onClick={handleTerminalClick}
      />
    </g>
  );
}
