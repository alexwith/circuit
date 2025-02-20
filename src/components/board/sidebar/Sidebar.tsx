import CreateCircuitButton from "./CreateCircuitButton";
import LogicComponents from "./logiccomponents/LogicComponents";
import TruthTable from "./TruthTable";

export default function Sidebar() {
  return (
    <div className="absolute flex flex-col gap-2 right-2 top-2 bottom-2">
      <CreateCircuitButton />
      <TruthTable />
      <LogicComponents />
    </div>
  );
}
