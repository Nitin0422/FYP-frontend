// import { SIDENAV_ITEMS } from "@/constants/SideNavItems";
import { ChevronLeft, Menu } from "lucide-react";
import { MenuItem } from "./menu-item";
import useAuth from "@/context/AuthContext";
import logo from "@/assets/logo/png/logo-no-background.png"; // import the image



import {
  ADMIN_SIDENAV_ITEMS,
  DOCTOR_SIDENAV_ITEMS,
  PATIENT_SIDENAV_ITEMS,
  SideNavItem,
} from "@/constants/SideNavItems";

interface SideBarProps {
  open: boolean;
  setOpen: () => void;
}

export const SideBarSM = ({ open, setOpen }: SideBarProps) => {
  let SIDENAV_ITEMS: SideNavItem[] = [];


  const { role } = useAuth();

  if (role === "admin") {
    SIDENAV_ITEMS = ADMIN_SIDENAV_ITEMS;
  } else if (role === "doctor") {
    SIDENAV_ITEMS = DOCTOR_SIDENAV_ITEMS;
  } else if (role == "patient") {
    SIDENAV_ITEMS = PATIENT_SIDENAV_ITEMS;
  } else {
    SIDENAV_ITEMS = []
  }
  return (
    <div className="wrapper">
      {!open ? (
        <div className="flex justify-center items-center pt-4">
          <Menu onClick={() => setOpen()} />
        </div>
      ) : (
        <div className="bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 h-screen">
          <div className="flex justify-between items-center px-5 py-4">
            <div className="flex gap-3">
              <img src={logo} alt="Logo" className="w-36" /> 
            </div>
            <ChevronLeft
              size={18}
              className={`cursor-pointer ${!open && "rotate-180"}`}
              onClick={() => setOpen()}
            />
          </div>

          <div className="flex flex-col space-y-2 px-3 mt-6">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const SideBar = () => {
  let SIDENAV_ITEMS: SideNavItem[] = [];

  const { role } = useAuth();

  if (role === "admin") {
    SIDENAV_ITEMS = ADMIN_SIDENAV_ITEMS;
  } else if (role === "doctor") {
    SIDENAV_ITEMS = DOCTOR_SIDENAV_ITEMS;
  } else if (role == "patient") {
    SIDENAV_ITEMS = PATIENT_SIDENAV_ITEMS;
  } else {
    SIDENAV_ITEMS = []
  }
  return (
    <div className="bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 h-screen">
      <div className="flex flex-row space-x-3 items-center justify-center pt-5 px-6 h-12 w-full ">
      <img src={logo} alt="Logo" className="w-36" /> 

      </div>

      <div className="flex flex-col space-y-3 px-1 mt-12 lg:px-3">
        {SIDENAV_ITEMS.map((item, idx) => {
          return <MenuItem key={idx} item={item} />;
        })}
      </div>
    </div>
  );
};
