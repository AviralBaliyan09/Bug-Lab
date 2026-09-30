import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } =
    useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl border
        border-slate-200
        bg-white
        text-slate-700
        shadow-sm
        transition
        hover:bg-slate-100
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-200
        dark:hover:bg-slate-800
      "
    >
      {theme === "light" ? (
        <span className="text-lg">🌙</span>
      ) : (
        <span className="text-lg">☀️</span>
      )}
    </button>
  );
}

export default ThemeToggle;