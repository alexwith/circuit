import Board from "./components/Board";

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-row items-center px-10 bg-darkest w-full h-15 border-b-2 border-b-dark">
        <h1 className="font-black text-2xl">Circuit</h1>
      </div>
      <div className="flex-grow w-full">
        <Board />
      </div>
    </div>
  );
}
