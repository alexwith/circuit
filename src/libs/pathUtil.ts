import { Pos } from "../common/types";

export function smoothSVGPath(points: Pos[], radius: number): string {
  if (points.length < 2) return "";

  const start = points[0];
  let path = "M 0,0";

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const offset: Pos = {
      x: point.x - start.x,
      y: point.y - start.y,
    };

    if (i === points.length - 1) {
      path += ` L ${offset.x},${offset.y}`;
      continue;
    }

    const previous = points[i - 1];
    const next = points[i + 1];

    const vecIn = { x: point.x - previous.x, y: point.y - previous.y };
    const vecOut = { x: next.x - point.x, y: next.y - point.y };

    const lenIn = Math.max(Math.hypot(vecIn.x, vecIn.y), 1);
    const lenOut = Math.max(Math.hypot(vecOut.x, vecOut.y), 1);
    const r = Math.min(radius, lenIn / 2, lenOut / 2);

    const startCorner = {
      x: point.x - (vecIn.x / lenIn) * r,
      y: point.y - (vecIn.y / lenIn) * r,
    };    

    const endCorner = {
      x: point.x + (vecOut.x / lenOut) * r,
      y: point.y + (vecOut.y / lenOut) * r,
    };

    const relStart = {
      x: startCorner.x - start.x,
      y: startCorner.y - start.y,
    };
      
    const relEnd = {
      x: endCorner.x - start.x,
      y: endCorner.y - start.y,
    };

    const relCorner = {
      x: point.x - start.x,
      y: point.y - start.y,
    };

    path += ` L ${relStart.x},${relStart.y}`;
    path += ` Q ${relCorner.x},${relCorner.y} ${relEnd.x},${relEnd.y}`;    
  }

  return path;
}