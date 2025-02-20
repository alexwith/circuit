import { useState } from "react";
import { TerminalEntity } from "../../entities/canvas/TerminalEntity";
import { useCanvasStore } from "../../store/canvasStore";
import { ChevronDownIcon, ChevronUpIcon } from "../../common/icons";

export default function TruthTable() {
  const [expanded, setExpanded] = useState<boolean>(true);

  const truthTable = useCanvasStore((store) => store.truthTable);
  const entities = useCanvasStore((store) => store.entities);

  return (
    <div
      className={`flex flex-col w-50 max-h-60 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm ${!expanded && "overflow-hidden hover:border-violet-400"}`}
      style={{
        height: expanded ? "fit-content" : "30px",
      }}
    >
      <div
        className="flex justify-between items-center px-3 py-1 text-dark dark:text-light hover:cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h1 className="font-medium text-sm select-none">Truth Table</h1>
        {expanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
      </div>
      <div className="overflow-auto py-1 px-3">
        <table className="text-lightest text-center text-sm border-collapse border-hidden">
          <thead>
            <tr className="text-dark-light">
              {entities
                .filter((entity) => entity instanceof TerminalEntity)
                .map((terminal, i) => (
                  <th
                    className="px-1 border-1 border-light dark:border-light-dark font-medium"
                    key={i}
                  >
                    {"Name"}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {truthTable.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((value, j) => (
                    <td
                      key={j}
                      className="border-1 border-light dark:border-light-dark font-medium"
                      style={{
                        color: value ? "var(--color-red-400)" : "var(--color-blue-400)",
                      }}
                    >
                      {value ? 1 : 0}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
