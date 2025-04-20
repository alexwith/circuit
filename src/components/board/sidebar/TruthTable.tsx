import { useCallback, useState } from "react";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { useCanvasStore } from "../../../store/canvasStore";
import { ChevronDownIcon, ChevronUpIcon } from "../../../common/icons";
import { Flow } from "../../../common/types";

export default function TruthTable() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const truthTable: boolean[][] = useCanvasStore((state) => state.truthTable);
  const entities = useCanvasStore((state) => state.entities);

  const createTableHeads = useCallback(
    (flow: Flow) => {
      return entities
        .filter((entity) => entity instanceof TerminalEntity)
        .filter((terminal) => terminal.flow === flow)
        .sort((a, b) => a.pos.y - b.pos.y)
        .map((terminal, i) => (
          <th className="px-1 border-1 border-light dark:border-light-dark font-medium" key={i}>
            {terminal.name}
          </th>
        ));
    },
    [entities],
  );  

  return (
    <div
      className={`flex flex-col w-50 max-h-60 gap-1 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm ${!expanded && "overflow-hidden hover:border-violet-400"}`}
      style={{
        height: expanded ? "fit-content" : "33px",
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
        {truthTable.length === 0 || truthTable[0].length === 0 ? (
          <p className="text-sm text-darkest-light dark:text-dark-light font-medium">
            There is not enough information to generate a truth table
          </p>
        ) : truthTable.length > 1000 ? (
          <p className="text-sm text-darkest-light dark:text-dark-light font-medium">
            The truth table is too large to display
          </p>
        ) : (
          <table className="text-lightest text-center text-sm border-collapse border-hidden">
            <thead>
              <tr className="text-dark-light">
                {createTableHeads(Flow.In)}
                {createTableHeads(Flow.Out)}
              </tr>
            </thead>
            <tbody>
              {truthTable.map((row, i) => {
                return (
                  <tr key={i}>
                    {row.map((value, j) => (
                      <td
                        key={j}
                        className="px-1 border-1 border-light dark:border-light-dark font-medium"
                        style={{
                          color: value ? "var(--color-red-400)" : "var(--color-blue-400)",
                        }}
                      >
                        {value ? "1" : "0"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
