import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../common/icons";
import DraggableLogic from "./DraggableLogic";

export default function LogicBuilder() {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="absolute top-2 right-2 bottom-2 z-20">
      <div
        className="flex flex-col w-56 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm duration-200 ease overflow-hidden"
        style={{
          height: expanded ? "100%" : "35px",
        }}
      >
        <div
          className="flex justify-between items-center px-3 py-1 hover:cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h1 className="text-dark dark:text-light font-medium select-none">Logic</h1>
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        <div className="w-full h-0.25 bg-dark-light dark:bg-light-dark" />
        <div className="flex flex-col gap-4 px-3 py-1">
          <div>
            <h1 className="select-none text-violet-400 font-medium">Core</h1>
            <div className="relative flex flex-col gap-1">
              <DraggableLogic name="In Terminal" />
              <DraggableLogic name="Out Terminal" />
            </div>
          </div>
          <div>
            <h1 className="select-none text-violet-400 font-medium">Circuits</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
