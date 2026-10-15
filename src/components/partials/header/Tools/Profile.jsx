import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { axiosFireApi, setAccessToken } from "../../../../services/config";
import { getUserDisplayName, handleLogout } from "@/pages/auth/common/store";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const displayName = getUserDisplayName(user);

  const logout = async () => {
    await axiosFireApi("logout", "post");
    setAccessToken(null);
    dispatch(handleLogout());
    toast.success("Signed out");
    navigate("/");
  };

  const profileLabel = () => {
    const initial = displayName.trim().charAt(0).toUpperCase() || "A";
    return (
      <div className="flex items-center">
        <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
          <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full bg-primary-600 text-white grid place-items-center text-xs font-medium">
            {initial}
          </div>
        </div>
        <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
            {displayName}
          </span>
          <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
            <Icon icon="heroicons-outline:chevron-down" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dropdown classMenuItems="w-[180px] top-[58px]" label={profileLabel()}>
      <Menu.Item>
        {({ active }) => (
          <div
            onClick={logout}
            className={`${
              active
                ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                : "text-slate-600 dark:text-slate-300"
            } block`}
          >
            <div className="block cursor-pointer px-4 py-2">
              <div className="flex items-center">
                <span className="block text-xl ltr:mr-3 rtl:ml-3">
                  <Icon icon="heroicons-outline:logout" />
                </span>
                <span className="block text-sm">Sign out</span>
              </div>
            </div>
          </div>
        )}
      </Menu.Item>
    </Dropdown>
  );
};

export default Profile;
