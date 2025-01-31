type Props = {
  name: string;
};

export default function DraggableLogic({ name }: Props) {
  return (
    <div className="bg-light-dark px-2 py-1 rounded-sm text-violet-400 hover:cursor-grab" draggable>
      <h1>{name}</h1>
    </div>
  );
}
