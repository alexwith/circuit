import { Pos } from "../common/types";

export function distancePosToLineSq(a: Pos, b: Pos, p: Pos): number {
  const lineDelta = { x: a.x - b.x, y: a.y - b.y };
  const posDelta = { x: p.x - a.x, y: p.y - a.y };

  const dot = lineDelta.x * -posDelta.y + lineDelta.y * posDelta.x;
  const lenSq = posDelta.y * posDelta.y + posDelta.x * posDelta.x;
  return (dot * dot) / lenSq;
}

export function closestPosOnLine(a: Pos, b: Pos, p: Pos) {
  const lineDelta = { x: b.x - a.x, y: b.y - a.y };
  const pointDelta = { x: p.x - a.x, y: p.y - a.y };
  const lineLengthSq = lineDelta.x * lineDelta.x + lineDelta.y * lineDelta.y;

  if (lineLengthSq == 0) {
    return a;
  }

  const dot = pointDelta.x * lineDelta.x + pointDelta.y * lineDelta.y;
  const t = Math.max(Math.min(dot / lineLengthSq, 1), 0);

  return {
    x: a.x + lineDelta.x * t,
    y: a.y + lineDelta.y * t,
  };
}
