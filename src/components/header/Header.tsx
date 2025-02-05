import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between px-10 w-full h-15 border-b-2 border-b-light dark:border-b-dark">
      <h1 className="font-black text-2xl text-darkest dark:text-lightest">Circuit</h1>
      <ThemeToggle />
    </div>
  );
}
