import { useEffect, useRef, useState } from "react";
import TextInput from "../common/TextInput";
import { serialize } from "../../libs/circuitFile";
import { useCanvasStore } from "../../store/canvasStore";

enum ExportType {
  Circuit,
  PNG,
}

type Props = {
  onClose: () => void;
};

export default function ExportMenu({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current === null || ref.current.contains(event.target as Node | null)) {
        return;
      }

      setError(null);
      onClose();
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [ref, onClose]);

  const handleExportClick = (type: ExportType) => {
    if (name.length <= 0) {
      setError("You must provide a name for the circuit.");
      return;
    }

    onClose();

    const { gateTypes, entities } = useCanvasStore.getState();

    switch (type) {
      case ExportType.Circuit: {
        const data = serialize(gateTypes, entities);
        const fileURL = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));

        const downloadElement = document.createElement("a");
        downloadElement.href = fileURL;
        downloadElement.download = `${name}.circuit`;
        document.body.appendChild(downloadElement);

        window.requestAnimationFrame(() => {
          downloadElement.click();
          document.body.removeChild(downloadElement);
        });
        break;
      }
      case ExportType.PNG: {
        console.log("png exports");
        break;
      }
    }
  };

  return (
    <div className="fixed w-full h-full right-0 top-0 backdrop-blur-[2px] z-20">
      <div
        ref={ref}
        className="absolute flex flex-col gap-2 top-[40%] left-[50%] -translate-[50%] m-auto w-73 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-md px-3 py-2"
      >
        <h1 className="font-medium text-dark dark:text-light">Exporting circuit</h1>
        <p className="text-darkest-light dark:text-lightest-dark text-sm">
          Export your logic as a file for later use or an image
        </p>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <TextInput
          className="border-darkest-light dark:border-lightest-dark text-dark dark:text-lightest text-sm"
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <div className="flex gap-2">
          <div
            className="bg-light-dark px-3 py-1 rounded-md border-1 border-transparent hover:cursor-pointer hover:border-violet-400"
            onClick={() => handleExportClick(ExportType.Circuit)}
          >
            <h1 className="text-sm text-lightest">Export as circuit</h1>
          </div>
          <div
            className="bg-light-dark px-3 py-1 rounded-md border-1 border-transparent hover:cursor-pointer hover:border-violet-400"
            onClick={() => handleExportClick(ExportType.PNG)}
          >
            <h1 className="text-sm text-lightest">Export as PNG</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
