import { useEffect, useRef, useState } from "react";
import TextInput from "../../common/TextInput";

export default function CreateCircuitButton() {
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current === null || menuRef.current.contains(event.target as Node | null)) {
        return;
      }

      setMenuOpen(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [menuRef]);

  const handleOpenMenuClick = () => {
    setMenuOpen(true);
  };

  const handleCreateClick = () => {};

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
            <TextInput
              className="border-darkest-light dark:border-lightest-dark text-dark dark:text-lightest text-sm"
              onChange={() => {}}
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
