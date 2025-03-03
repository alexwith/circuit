import { useEffect, useState } from "react";
import { serialize } from "../../libs/circuitFile";
import { useCanvasStore } from "../../store/canvasStore";
import {
  subscribeElementChange,
  unsubscribeElementChange,
} from "../../libs/canvasElementChangeEvent";

export default function SaveToggle() {
  const [saved, setSaved] = useState<boolean>(true);

  useEffect(() => {
    const markDirty = () => {
      setSaved(false);
    };

    subscribeElementChange(markDirty);
    return () => unsubscribeElementChange(markDirty);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((!event.ctrlKey && !event.metaKey) || event.key !== "s") {
        return;
      }

      event.preventDefault();

      handleSave();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSave = () => {
    const { gateTypes, entities } = useCanvasStore.getState();

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target) {
        return;
      }

      localStorage.setItem("current-circuit", event.target.result as string);
    };

    const data = serialize(gateTypes, entities);
    reader.readAsDataURL(new Blob([data], { type: "text/plain" }));

    setSaved(true);
  };

  if (!saved) {
    return (
      <h1
        className="hidden sm:block bg-red-500/30 text-red-500 text-sm font-medium rounded-md px-2 py-1 hover:cursor-pointer"
        onClick={handleSave}
      >
        Not Saved
      </h1>
    );
  }

  return (
    <h1 className="hidden sm:block bg-green-500/30 text-green-500 text-sm font-medium rounded-md px-2 py-1">
      Saved
    </h1>
  );
}
