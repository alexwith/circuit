import { useState } from "react";
import { DarkThemeIcon, LightThemeIcon } from "../../common/icons";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  const handleThemeToggle = () => {
    setDarkTheme(!darkTheme);

    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className="flex items-center gap-2 p-2 text-darkest-light text-sm rounded-md hover:cursor-pointer hover:text-violet-500 hover:dark:bg-light-dark hover:bg-light"
      onClick={handleThemeToggle}
    >
      {darkTheme ? (
        <>
          <LightThemeIcon size={18} />
          <p>Light Theme</p>
        </>
      ) : (
        <>
          <DarkThemeIcon size={15} />
          <p>Dark Theme</p>
        </>
      )}
    </div>
  );
}
