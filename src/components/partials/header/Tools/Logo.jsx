import React from "react";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
import useDarkMode from "@/hooks/useDarkMode";

const Logo = () => {
  const { width, breakpoints } = useWidth();
  const [isDark] = useDarkMode();

  if (width >= breakpoints.xl) return null;

  return (
    <Link to="/home" className="inline-flex items-center gap-2">
      <span
        className={`h-8 w-8 rounded-xl grid place-items-center text-xs font-semibold ${
          isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"
        }`}
      >
        AI
      </span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">
        AI Docs
      </span>
    </Link>
  );
};

export default Logo;
