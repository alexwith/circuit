import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../../common/icons";
import DraggableLogic from "./DraggableLogic";

export default function LogicBuilder() {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="absolute top-2 right-2 bottom-2 z-20">
      <div
        className="flex flex-col w-56 gap-1 bg-dark text-gray-400 border-1 border-light-dark rounded-sm duration-200 ease overflow-hidden"
        style={{
          height: expanded ? "100%" : "35px",
        }}
      >
        <div
          className="flex justify-between items-center px-3 py-1 text-white hover:cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h1 className="font-medium select-none">Logic builder</h1>
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        <div className="w-full h-0.25 bg-light-dark" />
        <div className="flex flex-col gap-4 px-3 py-1">
          <div>
            <h1 className="select-none text-violet-400">Core</h1>
            <div className="flex flex-col gap-1">
              <DraggableLogic name="In terminal" />
              <DraggableLogic name="Out terminal" />
            </div>
          </div>
          <div>
            <h1 className="select-none text-violet-400">Circuits</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
