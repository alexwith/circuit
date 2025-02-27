import SaveToggle from "./SaveToggle";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between px-10 w-full h-15 border-b-2 border-b-light dark:border-b-dark">
      <h1 className="border-violet-400 border-b-3 font-black text-2xl text-dark dark:text-light">
        Circuit
      </h1>
      <div className="flex font-medium gap-5 text-sm text-darkest dark:text-lightest">
        <p className="hover:text-violet-400 hover:cursor-pointer">Import</p>
        <p className="hover:text-violet-400 hover:cursor-pointer">Export</p>
        <a
          className="hover:text-violet-400 hover:cursor-pointer"
          href="https://github.com/alexwith/circuit"
          target="_blank"
        >
          GitHub
        </a>
      </div>
      <div className="flex items-center gap-3">
        <SaveToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
