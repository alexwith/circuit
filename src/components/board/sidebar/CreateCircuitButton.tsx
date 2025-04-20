import { useEffect, useRef, useState } from "react";
import TextInput from "../../common/TextInput";
import { createGateTypeEntity, GateTypeEntity } from "../../../entities/other/GateTypeEntity";
import { useCanvasStore } from "../../../store/canvasStore";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { Flow } from "../../../common/types";

export default function CreateCircuitButton() {
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const addGateType = useCanvasStore((actions) => actions.addGateType);
  const setEntities = useCanvasStore((actions) => actions.setEntities);
  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current === null || menuRef.current.contains(event.target as Node | null)) {
        return;
      }

      setMenuOpen(false);
      setError(null);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [menuRef]);

  const handleOpenMenuClick = () => {
    setMenuOpen(true);
  };

  const handleCreateClick = () => {
    computeTruthTable();

    const { entities, truthTable, gateTypes } = useCanvasStore.getState();

    const terminals: TerminalEntity[] = entities.filter(
      (entity) => entity instanceof TerminalEntity,
    );
    const inputs: number = terminals.filter((terminal) => terminal.flow === Flow.In).length;
    const outputs: number = terminals.length - inputs;

    if (entities.length === 0 || inputs <= 0 || outputs <= 0) {
      setError("The cirucuit needs at least one input and output.");
      return;
    }

    if (name == null || name.length < 1) {
      setError("You must provide a name for the circuit.");
      return;
    }

    if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(name)) {
      setError("The name can only contain letters, numbers and single spaces.");
      return;
    }

    if (gateTypes.find((otherType) => otherType.name.toUpperCase() === name.toUpperCase())) {
      setError("There's already a circuit with this name.");
      return;
    }

    const flatTruthTable = truthTable.reduce<{ [inputs: string]: string }>(
      (transformed, valuation) => {
        transformed[
          valuation
            .slice(0, inputs)
            .map((value) => (value ? "1" : "0"))
            .join("")
        ] = valuation
          .slice(inputs)
          .map((value) => (value ? "1" : "0"))
          .join("");
        return transformed;
      },
      {},
    );

    const gateType: GateTypeEntity = createGateTypeEntity(name, inputs, outputs, flatTruthTable);

    setMenuOpen(false);
    setError(null);
    addGateType(gateType);
    setEntities([]);
    computeTruthTable();
  };

  return (
    <>
      {menuOpen && (
        <div className="fixed w-full h-full right-0 top-0 backdrop-blur-[2px] z-20">
          <div
            ref={menuRef}
            className="absolute flex flex-col gap-2 top-[40%] left-[50%] -translate-[50%] m-auto w-70 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-md px-3 py-2"
          >
            <h1 className="font-medium text-dark dark:text-light">Creating circuit</h1>
            <p className="text-darkest-light dark:text-lightest-dark text-sm">
              Convert your current logic into a reusable circuit that you can use within this
              project
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <TextInput
              className="border-darkest-light dark:border-lightest-dark text-dark dark:text-lightest text-sm"
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <div
              className="w-fit ml-auto bg-light-dark px-3 py-1 rounded-md border-1 border-transparent hover:cursor-pointer hover:border-violet-400"
              onClick={handleCreateClick}
            >
              <h1 className="text-sm text-lightest">Create</h1>
            </div>
          </div>
        </div>
      )}
      <div
        className="w-50 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm hover:border-violet-400 hover:cursor-pointer"
        onClick={handleOpenMenuClick}
      >
        <div className="flex items-center gap-1 px-3 py-1">
          <h1 className="font-medium text-sm text-dark dark:text-light">Create Circuit</h1>
        </div>
      </div>
    </>
  );
}
