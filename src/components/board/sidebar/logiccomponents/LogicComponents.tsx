import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../../common/icons";
import DraggableLogic from "./DraggableLogic";
import Terminal from "../../elements/Terminal";
import { EntityType, Flow } from "../../../../common/types";
import { useCanvasStore } from "../../../../store/canvasStore";
import Gate from "../../elements/Gate";

export default function LogicComponents() {
  const gateTypes = useCanvasStore((state) => state.gateTypes);

  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="h-full">
      <div
        className={`flex flex-col w-50 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm duration-100 ease overflow-hidden ${!expanded && "hover:border-violet-400"}`}
        style={{
          height: expanded ? "100%" : "30px",
        }}
      >
        <div
          className="flex justify-between items-center px-3 py-1 text-dark dark:text-light hover:cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h1 className="font-medium text-sm select-none">Components</h1>
          {expanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
        </div>
        <div className="w-full h-0.25 bg-dark-light dark:bg-light-dark" />
        <div className="flex flex-col gap-4 px-3 py-1">
          <div>
            <h1 className="text-sm select-none text-violet-400 font-medium">Terminals</h1>
            <div className="relative flex flex-col gap-1">
              <DraggableLogic
                type={EntityType.InTerminal}
                name="In Terminal"
                displayElement={<Terminal flow={Flow.In} />}
              />
              <DraggableLogic
                type={EntityType.OutTerminal}
                name="Out Terminal"
                displayElement={<Terminal flow={Flow.Out} />}
              />
            </div>
          </div>
          <div>
            <h1 className="text-sm select-none text-violet-400 font-medium">Circuits</h1>
            <div className="relative flex flex-col gap-1">
              {gateTypes.map((gateType, key) => {
                return (
                  <DraggableLogic
                    key={key}
                    type={EntityType.Gate}
                    name={gateType.name}
                    displayElement={<Gate gateType={gateType} />}
                    metadata={gateType}
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
