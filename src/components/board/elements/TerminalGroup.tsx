import { Flow } from "../../../common/types";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";

type Props = {
  group: TerminalEntity[];
};

// excuse all the magic numbers, it's really mostly positing for styling, theres not much logic to it
export default function TerminalGroup({ group }: Props) {
  let result = 0;
  for (let i = 0; i < group.length; i++) {    
    if (group[i].pin.active) {
      result |= 1 << (group.length - i - 1);
    }
  }

  const firstTerminal = group[0];
  const lastTerminal = group[group.length - 1];
  const origin = firstTerminal.pos;
  const flow = firstTerminal.flow

  const xOffset = flow == Flow.In ? -25 : 100;
  const textXOffset = flow == Flow.In ? -12 : 90;
  const endsXOffset = flow == Flow.In ? 0 : -16;

  return (
    <g transform={`translate(${origin.x}, ${origin.y})`}>
      <text
        className="fill-violet-500 text-4xl font-medium"
        x={textXOffset}
        y={(lastTerminal.pos.y - origin.y) / 2 + 18}
        textAnchor={flow == Flow.In ? "end" : "start"}
        dominantBaseline="middle"
      >
        {result}
      </text>
      <rect
        className="fill-darkest-light dark:fill-light-dark"
        x={xOffset + endsXOffset}
        y={-6}
        width={20}
        height={4}
      />
      <rect
        className="fill-darkest-light dark:fill-light-dark"
        x={xOffset + endsXOffset}
        y={lastTerminal.pos.y - origin.y + 36}
        width={20}
        height={4}
      />
      <rect
        className="fill-darkest-light dark:fill-light-dark"
        x={xOffset}
        y={-6}
        width={4}
        height={(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 - 20}
      />
      <rect
        className="fill-darkest-light dark:fill-light-dark"
        x={xOffset}
        y={(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 + 10}
        width={4}
        height={(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 - 20}
      />
    </g>
  );
}