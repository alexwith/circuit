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
import { dispatchElementChange } from "../../../libs/canvasElementChangeEvent";
import TerminalGroup from "../elements/TerminalGroup";

type Props = {
  canvasRef: RefObject<SVGSVGElement | null>;
};

export default function CanvasElements({ canvasRef }: Props) {
  const entities = useCanvasStore((state) => state.entities);
  const zoom = useCanvasStore((state) => state.zoom);

  const addEntity = useCanvasStore((actions) => actions.addEntity);
  const simulate = useCanvasStore((actions) => actions.simulate);
  const updatePos = useCanvasStore((actions) => actions.updatePos);
  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);

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

    const handleMouseMove = (event: MouseEvent) => {
      let entities = [draggingEntity];
      if (draggingEntity instanceof TerminalEntity) {
        entities = (draggingEntity as TerminalEntity).group;
      }

      for (let entity of entities) {
        let currentPos = entity.getPos();
        const newPos = {
          x: currentPos.x + event.movementX / zoom,
          y: currentPos.y + event.movementY / zoom,
        };
        currentPos = newPos;

        entity.updatePos(() => ({
          x: newPos.x,
          y: newPos.y,
        }));
      }

      /*let currentPos = draggingEntity.getPos();
      const newPos = {
        x: currentPos.x + event.movementX / zoom,
        y: currentPos.y + event.movementY / zoom,
      };
      currentPos = newPos;

      draggingEntity!.updatePos(() => ({
        x: newPos.x,
        y: newPos.y,
      }));*/
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
    [isWiring, wiringStartPin, wiringPoints, addEntity, simulate, computeTruthTable]
  );

  const handleEntityStartDrag = (entity: CanvasEntity) => {
    // Do not allow dragging of wires
    if (entity instanceof WireEntity) {
      return;
    }

    setDraggingEntity(entity);
    dispatchElementChange();
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
          onCancel={() => {
            setIsWiring(false);
          }}
        />
      )}
      {entities.map((entity, key) => {
        if (!(entity instanceof TerminalEntity)) {
          return;
        }

        const terminal = entity as TerminalEntity;
        const group = terminal.group;
        if (group.length <= 1 || group.indexOf(terminal) == 0) {
          return;
        }

        return <TerminalGroup key={key} group={terminal.group} />;
      })}
    </>
  );
}
