import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../../../common/icons";
import DraggableLogic from "./DraggableLogic";
import Terminal from "../../elements/Terminal";
import { EntityType, Flow } from "../../../../common/types";
import { useCanvasStore } from "../../../../store/canvasStore";
import Gate from "../../elements/Gate";
import { TerminalEntity } from "../../../../entities/canvas/TerminalEntity";

const INPUTS_WARNING_THRESHOLD = 20;

export default function LogicComponents() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [groupSize, setGroupSize] = useState<number>(2);

  const gateTypes = useCanvasStore((state) => state.gateTypes);
  const entities = useCanvasStore((state) => state.entities);

  const terminalCount = entities.filter(
    (entity) => entity instanceof TerminalEntity && entity.flow == Flow.In
  ).length;

  return (
    <div className="h-full min-h-0">
      <div
        className={`flex flex-col w-50 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm duration-100 ease overflow-hidden ${
          !expanded && "hover:border-violet-400"
        }`}
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
        <div className="flex flex-col gap-4 px-3 py-1 overflow-auto">
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
            {terminalCount >= INPUTS_WARNING_THRESHOLD && (
              <div className="my-2">
                <h1 className="text-red-400 text-sm font-medium">Warning!</h1>
                <p className="text-lightest-dark dark:text-dark-light text-xs">
                  Adding more inputs may slow the website, as the circuit already has over a million
                  valuations.
                </p>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-sm select-none text-violet-400 font-medium">Terminal Groups</h1>
            <div className="relative flex flex-col gap-1">
              <div className="flex flex-col gap-1 my-1">
                <p className="text-violet-400 font-medium text-xs">Group Size: {groupSize}</p>
                <input
                  className="appearance-none bg-light dark:bg-light-dark h-2 rounded-full range-sm"
                  type="range"
                  min="2"
                  max="8"
                  value={groupSize}            
                  onChange={(event) => {
                    setGroupSize(parseInt(event.target.value));
                  }}
                />
              </div>
              <DraggableLogic
                type={EntityType.InTerminal}
                name="In Terminal Group"
                displayElement={
                  <div className="flex flex-col gap-2">
                    {[...Array(groupSize)].map((_, i) => (
                      <Terminal key={i} flow={Flow.In} />
                    ))}
                  </div>
                }
                metadata={{ groupSize }}
              />
              <DraggableLogic
                type={EntityType.OutTerminal}
                name="Out Terminal Group"
                displayElement={
                  <div className="flex flex-col gap-2">
                    {[...Array(groupSize)].map((_, i) => (
                      <Terminal key={i} flow={Flow.Out} />
                    ))}
                  </div>
                }
                metadata={{ groupSize }}
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
