import { useEffect, useState } from "react";
import { DarkThemeIcon, LightThemeIcon } from "../../common/icons";
import { isDarkTheme } from "../../libs/themeUtil";

export default function ThemeToggle() {
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  const handleThemeToggle = () => {
    localStorage.theme = darkTheme ? "light" : "dark";
    setDarkTheme(!darkTheme);

    document.documentElement.classList.toggle("dark", isDarkTheme());
  };

  useEffect(() => {
    const isDark = isDarkTheme();
    document.documentElement.classList.toggle("dark", isDark);

    setDarkTheme(isDark);
  }, [setDarkTheme]);

  return (
    <div
      className="flex items-center gap-2 p-2 text-darkest dark:text-lightest text-sm rounded-md hover:cursor-pointer hover:text-violet-400 hover:dark:bg-light-dark hover:bg-light"
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
