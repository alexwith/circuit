import { useCanvasStore } from "../../../store/canvasStore";
import WiringWire from "../elements/WiringWire";
import Terminal from "../elements/Terminal";
import CanvasElement from "./CanvasElement";
import { ReactNode, RefObject, useCallback, useEffect, useState } from "react";
import { CanvasEntity } from "../../../entities/canvas/CanvasEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { PinEntity } from "../../../entities/canvas/PinEntity";
import { WireEntity } from "../../../entities/canvas/WireEntity";
import Wire from "../elements/Wire";
import { Pos } from "../../../common/types";
import Gate from "../elements/Gate";
import { GateEntity } from "../../../entities/canvas/GateEntity";

type Props = {
  canvasRef: RefObject<SVGSVGElement>;
};

export default function CanvasElements({ canvasRef }: Props) {
  const entities = useCanvasStore((state) => state.entities);
  const zoom = useCanvasStore((state) => state.zoom);

  const addEntity = useCanvasStore((state) => state.addEntity);
  const simulate = useCanvasStore((state) => state.simulate);
  const updatePos = useCanvasStore((state) => state.updatePos);
  const computeTruthTable = useCanvasStore((state) => state.computeTruthTable);

  const [isWiring, setIsWiring] = useState<boolean>(false);
  const [wiringStartPin, setWiringStartPin] = useState<PinEntity | null>(null);
  const [wiringPoints, setWiringPoints] = useState<Pos[]>([{ x: 0, y: 0 }]);

  const [draggingEntity, setDraggingEntity] = useState<CanvasEntity | null>(null);

  useEffect(() => {
    if (!draggingEntity) {
      return;
    }

    const handleMouseUp = () => {
      setDraggingEntity(null);
    };

    let currentPos = draggingEntity.getPos();
    const handleMouseMove = (event: MouseEvent) => {
      const newPos = {
        x: currentPos.x + event.movementX / zoom,
        y: currentPos.y + event.movementY / zoom,
      };
      currentPos = newPos;

      draggingEntity!.updatePos(() => ({
        x: newPos.x,
        y: newPos.y,
      }));
      // trigger a rerender of the canvas
      updatePos((prev) => ({ x: prev.x, y: prev.y }));
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [draggingEntity, zoom, updatePos]);

  const handlePinClick = useCallback(
    (pin: PinEntity) => {
      if (isWiring) {
        setIsWiring(false);

        wiringPoints.pop(); // pop last element of wiring points as this will just be the pin
        addEntity(new WireEntity(wiringStartPin!, pin, wiringPoints));
        computeTruthTable();
        simulate();
      } else {
        setWiringPoints([]);
        setWiringStartPin(pin);
        setIsWiring(true);
      }
    },
    [isWiring, wiringStartPin, wiringPoints, addEntity, simulate, computeTruthTable],
  );

  const handleEntityStartDrag = (entity: CanvasEntity) => {
    // Do not allow dragging of wires
    if (entity instanceof WireEntity) {
      return;
    }

    setDraggingEntity(entity);
  };

  const createElement = (entity: CanvasEntity): ReactNode => {
    switch (true) {
      case entity instanceof TerminalEntity: {
        const terminal = entity as TerminalEntity;
        return <Terminal entity={terminal} flow={terminal.flow} onPinClick={handlePinClick} />;
      }
      case entity instanceof GateEntity: {
        const gate = entity as GateEntity;
        return <Gate entity={gate} gateType={gate.type} onPinClick={handlePinClick} />;
      }
      case entity instanceof WireEntity: {
        const wire = entity as WireEntity;
        return (
          <Wire entity={wire} points={[wire.pin0.getPos(), ...wire.points, wire.pin1.getPos()]} />
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      {entities.map((entity, key) => {
        const element = createElement(entity);
        return (
          element && (
            <CanvasElement
              key={key}
              pos={entity.getPos()}
              zIndex={entity.getZIndex()}
              element={element}
              onMouseDown={() => handleEntityStartDrag(entity)}
            />
          )
        );
      })}
      {isWiring && (
        <WiringWire
          canvasRef={canvasRef}
          startPos={wiringStartPin!.getPos()}
          points={wiringPoints}
          setPoints={setWiringPoints}
        />
      )}
    </>
  );
}
