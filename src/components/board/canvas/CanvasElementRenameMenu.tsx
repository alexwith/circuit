import { useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../../../store/canvasStore";
import TextInput from "../../common/TextInput";
import { CanvasEntity } from "../../../entities/canvas/CanvasEntity";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";
import { dispatchElementChange } from "../../../libs/canvasElementChangeEvent";

type Props = {
  entity: CanvasEntity;
  onClose: () => void;
};

export default function CanvasElementRenameMenu({ entity, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>(
    (entity instanceof TerminalEntity ? entity.name : null) || "?"
  );

  const computeTruthTable = useCanvasStore((actions) => actions.computeTruthTable);
  const updatePos = useCanvasStore((actions) => actions.updatePos);

  const handleRenameClick = () => {
    if (entity instanceof TerminalEntity) {
      entity.name = name || "?";
      computeTruthTable();
      dispatchElementChange();

      updatePos((prev) => ({ x: prev.x, y: prev.y })); // trigger a rerender of the canvas
    }

    onClose();
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current === null || menuRef.current.contains(event.target as Node | null)) {
        return;
      }

      onClose();
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [menuRef]);

  return (
    <div className="fixed w-full h-full right-0 top-0 backdrop-blur-[2px] z-20">
      <div
        ref={menuRef}
        className="absolute flex flex-col gap-2 top-[40%] left-[50%] -translate-[50%] m-auto w-70 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-md px-3 py-2"
      >
        <h1 className="font-medium text-dark dark:text-light">Renaming terminal</h1>
        <p className="text-darkest-light dark:text-lightest-dark text-sm">The name is used to identify the element in the canvas and in the truth table</p>
        <TextInput
          className="border-darkest-light dark:border-lightest-dark text-dark dark:text-lightest text-sm"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <div
          className="w-fit ml-auto bg-light dark:bg-light-dark px-3 py-1 rounded-md border-1 border-transparent hover:cursor-pointer hover:border-violet-400"
          onClick={handleRenameClick}
        >
          <h1 className="text-sm font-medium text-light-dark dark:text-lightest">Rename</h1>
        </div>
      </div>
    </div>
  );
}
