import { Flow } from "../../../common/types";
import { TerminalEntity } from "../../../entities/canvas/TerminalEntity";

type Props = {
  group: TerminalEntity[];
};

// excuse all the magic numbers, it's really mostly positing for styling
export default function TerminalGroup({ group }: Props) {
  let result = 0;
  for (let i = 0; i < group.length; i++) {    
    if (group[i].pin.active) {
      result |= 1 << i;
    }
  }

  const firstTerminal = group[0];
  const lastTerminal = group[group.length - 1];
  const origin = firstTerminal.pos;

  const xOffset = firstTerminal.flow == Flow.In ? -25 : 100;
  const textXOffset = firstTerminal.flow == Flow.In ? -100 : 150;
  const endsXOffset = firstTerminal.flow == Flow.In ? 0 : -16;

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${origin.x}px, ${origin.y}px)`,
      }}
    >
       <h1
        className="absolute text-violet-500 text-4xl font-medium"
        style={{
          transform: `translate(${textXOffset}px, ${(lastTerminal.pos.y - origin.y) / 2}px)`,
        }}
      >
        {result}
      </h1>
      <div
        className="absolute w-5 h-1 bg-light-dark"
        style={{
          transform: `translate(${xOffset + endsXOffset}px, ${-6}px)`,
        }}
      />
      <div
        className="absolute w-5 h-1 bg-light-dark"
        style={{
          transform: `translate(${xOffset + endsXOffset}px, ${lastTerminal.pos.y - origin.y + 36}px)`,
        }}
      />     
      <div
        className="absolute w-1 bg-light-dark"
        style={{
          height: `${lastTerminal.pos.y - origin.y + 36 + 6}px`,
          transform: `translate(${xOffset}px, ${-5}px)`,
        }}
      />
    </div>
  );
}
