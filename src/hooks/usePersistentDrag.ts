import { RefObject, useCallback, useEffect, useState } from "react";
import { Pos } from "../common/types";

type Props = {
  ref: RefObject<Element | null>;
  updatePos: (modifier: (prev: Pos) => Pos) => void;
  targetPredicate: (target: EventTarget | null) => boolean;
};

type Result = {
  dragging: boolean;
};

export function usePersistentDrag({ ref, updatePos, targetPredicate }: Props): Result {
  const [dragging, setDragging] = useState<boolean>(false);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!targetPredicate(event.target)) {
        return;
      }

      setDragging(true);
    },
    [targetPredicate],
  );

  const handlePointerMove = useCallback(
    (event: Event) => {
      if (!dragging) {
        return;
      }

      const pointerEvent = event as PointerEvent;
      updatePos((prev) => ({
        x: prev.x + pointerEvent.movementX,
        y: prev.y + pointerEvent.movementY,
      }));
    },
    [dragging, updatePos],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
    };
  }, [ref, handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    dragging,
  };
}
