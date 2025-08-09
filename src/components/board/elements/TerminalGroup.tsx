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
  const textXOffset = flow == Flow.In ? -130 : 90;
  const endsXOffset = flow == Flow.In ? 0 : -16;

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${origin.x}px, ${origin.y}px)`,
      }}
    >
       <h1
        className="absolute text-violet-500 text-4xl font-medium w-30"
        style={{
          transform: `translate(${textXOffset}px, ${(lastTerminal.pos.y - origin.y) / 2 + -4}px)`,
          textAlign: flow == Flow.In ? "end" : "start"
        }}
      >
        {result}
      </h1>
      <div
        className="absolute w-5 h-1 bg-darkest-light dark:bg-light-dark"
        style={{
          transform: `translate(${xOffset + endsXOffset}px, ${-6}px)`,
        }}
      />
      <div
        className="absolute w-5 h-1 bg-darkest-light dark:bg-light-dark"
        style={{
          transform: `translate(${xOffset + endsXOffset}px, ${lastTerminal.pos.y - origin.y + 36}px)`,
        }}
      />     
      <div
        className="absolute w-1 bg-darkest-light dark:bg-light-dark"
        style={{
          height: `${(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 - 20}px`,
          transform: `translate(${xOffset}px, ${-6}px)`,
        }}
      />
      <div
        className="absolute w-1 bg-darkest-light dark:bg-light-dark"
        style={{
          height: `${(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 - 20}px`,
          transform: `translate(${xOffset}px, ${(lastTerminal.pos.y - origin.y + 36 + 6 + 6) / 2 + 10}px)`,
        }}
      />
    </div>
  );
}