import React from "react";
import { Link } from "react-router-dom";
import useSidebar from "@/hooks/useSidebar";
import useSkin from "@/hooks/useSkin";

const SidebarLogo = ({ menuHover }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  const [skin] = useSkin();
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${
        skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
      }
      
      `}
    >
      <Link to="/home">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-primary-600 dark:bg-primary-500 text-white grid place-items-center text-xs font-semibold">
            AI
          </div>

          {(!collapsed || menuHover) && (
            <div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                AI Docs
              </h1>
            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150
          ${
            collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-slate-900 dark:bg-slate-400 dark:ring-offset-slate-700"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
