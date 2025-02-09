import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../common/icons";
import DraggableLogic from "./DraggableLogic";
import Terminal from "../elements/Terminal";
import { EntityType, Flow } from "../../../common/types";
import { useCanvasStore } from "../../../store/canvasStore";
import Gate from "../elements/Gate";

export default function LogicComponents() {
  const gateTypes = useCanvasStore((state) => state.gateTypes);

  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="absolute top-2 right-2 bottom-2 z-20">
      <div
        className="flex flex-col w-56 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm duration-200 ease overflow-hidden"
        style={{
          height: expanded ? "100%" : "35px",
        }}
      >
        <div
          className="flex justify-between items-center px-3 py-1 text-dark dark:text-light hover:cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h1 className="font-medium select-none">Components</h1>
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        <div className="w-full h-0.25 bg-dark-light dark:bg-light-dark" />
        <div className="flex flex-col gap-4 px-3 py-1">
          <div>
            <h1 className="select-none text-violet-400 font-medium">Terminals</h1>
            <div className="relative flex flex-col gap-1">
              <DraggableLogic
                name="In Terminal"
                displayElement={<Terminal flow={Flow.In} />}
                template={{ type: EntityType.InTerminal }}
              />
              <DraggableLogic
                name="Out Terminal"
                displayElement={<Terminal flow={Flow.Out} />}
                template={{ type: EntityType.OutTerminal }}
              />
            </div>
          </div>
          <div>
            <h1 className="select-none text-violet-400 font-medium">Circuits</h1>
            <div className="relative flex flex-col gap-1">
              {gateTypes.map((gateType, key) => {
                return (
                  <DraggableLogic
                    key={key}
                    name={gateType.name}
                    displayElement={<Gate />}
                    template={{ type: EntityType.InTerminal }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
