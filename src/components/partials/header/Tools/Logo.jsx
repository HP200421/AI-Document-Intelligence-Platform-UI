import React from "react";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";

const Logo = () => {
  const { width, breakpoints } = useWidth();
  if (width >= breakpoints.xl) return null;

  return (
    <Link to="/home" className="inline-flex items-center gap-2">
      <span
        className="grid h-8 w-8 place-items-center rounded-xl bg-primary-600 text-xs font-semibold text-white dark:bg-primary-500"
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
