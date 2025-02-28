import { ChangeEvent, useState } from "react";
import ExportMenu from "./ExportMenu";
import SaveToggle from "./SaveToggle";
import ThemeToggle from "./ThemeToggle";
import { deserialize } from "../../libs/circuitFile";
import { useCanvasStore } from "../../store/canvasStore";
import { dispatchElementChange } from "../../libs/canvasElementChangeEvent";
import { basicCircuits } from "../../common/basicGates";

export default function Header() {
  const [exporting, setExporting] = useState<boolean>(false);

  const setGateTypes = useCanvasStore((actions) => actions.setGateTypes);
  const setEntities = useCanvasStore((actions) => actions.setEntities);
  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);
  const simulate = useCanvasStore((actions) => actions.simulate);

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];
    event.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const [gateTypes, entities] = deserialize(buffer)!;
      setGateTypes(gateTypes);
      setEntities(entities);
      computeTruthTable();
      simulate();
      dispatchElementChange();
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportingClick = () => {
    setExporting(true);
  };

  const handleClearCanvasClick = () => {
    localStorage.removeItem("current-circuit");

    setGateTypes(basicCircuits);
    setEntities([]);
    computeTruthTable();
  };

  return (
    <div className="flex flex-row items-center justify-between px-10 w-full h-15 border-b-2 border-b-light dark:border-b-dark">
      <h1 className="border-violet-400 border-b-3 font-black text-2xl text-dark dark:text-light">
        Circuit
      </h1>
      <div className="flex font-medium gap-5 text-sm text-darkest dark:text-lightest">
        <div>
          <input className="hidden" type="file" id="import-button" onChange={handleImport} />
          <label className="hover:text-violet-400 hover:cursor-pointer" htmlFor="import-button">
            Import
          </label>
        </div>
        <p className="hover:text-violet-400 hover:cursor-pointer" onClick={handleExportingClick}>
          Export
        </p>
        <p className="hover:text-violet-400 hover:cursor-pointer" onClick={handleClearCanvasClick}>
          Clear Canvas
        </p>
        <a
          className="hover:text-violet-400 hover:cursor-pointer"
          href="https://github.com/alexwith/circuit"
          target="_blank"
        >
          GitHub
        </a>
      </div>
      <div className="flex items-center gap-3">
        <SaveToggle />
        <ThemeToggle />
      </div>
      {exporting && <ExportMenu onClose={() => setExporting(false)} />}
    </div>
  );
}
