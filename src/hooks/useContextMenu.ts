import { MouseEvent, useEffect, useState } from "react";

type ContextMenuData = {
  handleContextMenu: (event: MouseEvent) => void;
  showContextMenu: boolean;
};

export default function useContextMenu(): ContextMenuData {
  const [show, setShow] = useState<boolean>(false);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    setShow(true);
  };

  useEffect(() => {
    const handleClick = () => {
      setShow(false);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return { handleContextMenu, showContextMenu: show };
}
