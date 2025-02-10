import { ReactNode } from "react";
import { GATE_PIN_OFFSET } from "../../../common/canvasConfig";
import { Flow } from "../../../common/types";
import { GateEntity } from "../../../entities/canvas/GateEntity";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { GateTypeEntity } from "../../../entities/other/GateTypeEntity";
import Pin from "./Pin";

type Props = {
  gateType: GateTypeEntity;
  entity?: GateEntity;
  onPinClick?: (pin: PinEntity) => void;
};

export default function Gate({ gateType, entity, onPinClick }: Props) {
  const handlePinClick = (flow: Flow, yPos: number) => {
    if (!entity || !onPinClick) {
      return;
    }

    const pin = (flow === Flow.In ? entity.inputs : entity.outputs)[yPos];
    onPinClick(pin);
  };

  return (
    <div className="relative">
      <svg
        className="overflow-visible"
        style={{
          width: `${gateType.width}px`,
          height: `${gateType.height}px`,
        }}
      >
        {gateType.icon}
        <text
          className="fill-indigo-950 select-none"
          x={gateType.width / 2}
          y={gateType.height / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight={"bold"}
          fontSize={18}
          fontFamily={"Inter"}
        >
          {gateType.name}
        </text>
      </svg>
      {createPins(gateType, Flow.In, handlePinClick)}
      {createPins(gateType, Flow.Out, handlePinClick)}
    </div>
  );
}

function createPins(
  gateType: GateTypeEntity,
  flow: Flow,
  handlePinClick: (flow: Flow, yPos: number) => void,
): ReactNode {
  const amount = flow === Flow.In ? gateType.inputs : gateType.outputs;
  return [...Array(amount).keys()].map((yPos, key) => {
    return (
      <Pin
        key={key}
        offset={GATE_PIN_OFFSET(gateType, flow, yPos)}
        onClick={() => handlePinClick(flow, yPos)}
      />
    );
  });
}
