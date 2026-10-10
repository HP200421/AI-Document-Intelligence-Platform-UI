import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const MobileFooter = () => {
  return (
    <div className="bg-white dark:bg-slate-800 flex justify-around items-center fixed left-0 w-full z-[9999] bottom-0 py-3 px-4 border-t border-slate-100 dark:border-slate-700">
      <NavLink to="/home">
        {({ isActive }) => (
          <div className="flex flex-col items-center">
            <Icon
              icon="heroicons-outline:document-text"
              className={isActive ? "text-primary-500" : "text-slate-900 dark:text-white"}
            />
            <span className={`text-[11px] mt-1 ${isActive ? "text-primary-500" : "text-slate-500"}`}>
              Documents
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default MobileFooter;
