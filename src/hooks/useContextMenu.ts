import { MouseEvent, useEffect, useState } from "react";

type ContextMenuData = {
  handleContextMenu: (event: MouseEvent) => void;
  showContextMenu: boolean;
};

// We use this to close the previous context menu when a new one opens
let closeCallback: (() => void) | null = null;

export default function useContextMenu(): ContextMenuData {
  const [show, setShow] = useState<boolean>(false);
  const localCloseCallback = () => setShow(false);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();

    if (closeCallback) {
      closeCallback();
    }

    setShow(true);

    closeCallback = localCloseCallback;
  };

  useEffect(() => {
    const handleClick = () => {
      setShow(false);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);      

      if (closeCallback == localCloseCallback) {        
        closeCallback = null;
      }
    };
  }, []);

  return { handleContextMenu, showContextMenu: show };
}
