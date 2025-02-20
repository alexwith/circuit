export default function CreateCircuitButton() {
  return (
    <div className="w-50 bg-lightest dark:bg-dark border-1 border-dark-light dark:border-light-dark rounded-sm hover:border-violet-400 hover:cursor-pointer">
      <div className="flex items-center gap-1 px-3 py-1">
        <h1 className="font-medium text-sm text-dark dark:text-light">Create Circuit</h1>
      </div>
    </div>
  );
}
