import React, { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem(storageKey) ||
          localStorage.getItem("theme") ||
          localStorage.getItem("spamshield_theme");
        if (stored === "light" || stored === "dark") {
          return stored;
        }
      } catch (e) {
        // Ignore localStorage error
      }
    }
    return defaultTheme;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    try {
      localStorage.setItem(storageKey, theme);
      localStorage.setItem("theme", theme);
      localStorage.setItem("spamshield_theme", theme);
    } catch (e) {
      console.error("Error saving theme preference to localStorage", e);
    }
  }, [theme, storageKey]);

  // Synchronize across multiple tabs or windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (
        (e.key === storageKey || e.key === "theme" || e.key === "spamshield_theme") &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

/**
 * SidebarThemeToggle
 * A user-accessible, interactive theme toggle built specifically for the sidebar.
 * Includes segmented controls for Light / Dark modes and a quick toggle switch.
 */
export function SidebarThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSelectTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme === "dark" ? "Dark Mode" : "Light Mode"}`, {
      duration: 2000,
    });
  };

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    toggleTheme();
    toast.success(`Theme switched to ${next === "dark" ? "Dark Mode" : "Light Mode"}`, {
      duration: 2000,
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-100/80 dark:bg-zinc-900/60 p-3 transition-colors duration-200",
        className
      )}
      role="region"
      aria-label="Theme selection"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400">
          Appearance
        </span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      </div>

      {/* Segmented Dual Button Switcher */}
      <div
        className="grid grid-cols-2 p-1 gap-1 bg-slate-200/90 dark:bg-black/40 rounded-lg border border-slate-300/70 dark:border-zinc-800"
        role="radiogroup"
        aria-label="Theme switcher"
      >
        <button
          type="button"
          role="radio"
          aria-checked={!isDark}
          onClick={() => handleSelectTheme("light")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer select-none",
            !isDark
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Switch to Light Mode"
          aria-label="Switch to Light Mode"
        >
          <Sun className={cn("w-3.5 h-3.5", !isDark ? "text-amber-500 fill-amber-500/20" : "")} />
          <span>Light</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          onClick={() => handleSelectTheme("dark")}
          className={cn(
            "flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer select-none",
            isDark
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/80 font-bold"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
          )}
          title="Switch to Dark Mode"
          aria-label="Switch to Dark Mode"
        >
          <Moon className={cn("w-3.5 h-3.5", isDark ? "text-emerald-400 fill-emerald-400/20" : "")} />
          <span>Dark</span>
        </button>
      </div>

      {/* Interactive Quick Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className="mt-2 w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group"
        aria-label={`Toggle to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 font-medium">
          Toggle theme
        </span>
        <div
          className={cn(
            "w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center",
            isDark ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700"
          )}
        >
          <div
            className={cn(
              "w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200",
              isDark ? "translate-x-4" : "translate-x-0"
            )}
          />
        </div>
      </button>
    </div>
  );
}

/**
 * HeaderThemeToggle
 * A compact, accessible icon button for desktop and mobile headers.
 */
export function HeaderThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    toggleTheme();
    toast.success(`Switched to ${next === "dark" ? "Dark Mode" : "Light Mode"}`);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center shadow-xs",
        className
      )}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-emerald-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
