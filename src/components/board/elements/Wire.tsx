import { useEffect, useState } from "react";
import { Pos } from "../../../common/types";
import { roundCommands, SVGCommand } from "svg-round-corners";
import { WireEntity } from "../../../entities/canvas/WireEntity";

type Props = {
  entity?: WireEntity;
  points: Pos[];
};

export default function Wire({ entity, points }: Props) {
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    const pathCommands: SVGCommand[] = [];

    const startPoint = points[0];
    points.forEach((point, i) => {
      const offsetPoint = {
        x: point.x - startPoint.x,
        y: point.y - startPoint.y,
      };

      if (i === 0) {
        pathCommands.push({ marker: "M", values: offsetPoint });
        return;
      }

      pathCommands.push({ marker: "L", values: offsetPoint });
    });

    setPath(roundCommands(pathCommands, 7).path);
  }, [points]);

  return (
    <svg className="overflow-visible">
      <path
        className="stroke-4 stroke-dark-light dark:stroke-light-dark dark:stroke-red-500"
        fill="none"
        d={path}
      />
    </svg>
  );
}
