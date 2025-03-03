import Board from "./components/board/Board";
import Header from "./components/header/Header";

export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-lightest dark:bg-darkest">
      <Header />
      <Board />
    </div>
  );
}
