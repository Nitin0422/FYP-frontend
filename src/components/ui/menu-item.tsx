import { SideNavItem } from "@/constants/SideNavItems";
import { ChevronDownIcon, Dot } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const MenuItem = ({ item }: { item: SideNavItem }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(true);
    const toggleSubMenu = () => {
      setSubMenuOpen(!subMenuOpen);
    };
  
    return (
      <div className="">
        {item.submenu ? (
          <>
            <button onClick={toggleSubMenu} className={`flex flex-row items-center mb-2 p-2 rounded-lg w-full justify-between`}>
              <div className="flex flex-row space-x-2 items-center">
                {item.icon}
                <span className="flex  text-xs lg:text-sm">{item.title}</span>
              </div>
              <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                <ChevronDownIcon  width="18" height="18" />
              </div>
            </button>
            {subMenuOpen && (
              <div className="flex flex-col bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg lg:ml-3">
                {item.subMenuItems?.map((subItem, idx) => {
                  return (
                    <Link key={idx} to={subItem.path} className={`flex py-1 justify-start items-center${subItem.path === window.location.pathname ? ' bg-green-600 rounded-lg' : ''}`}>
                      <Dot />
                      <span className="text-[10px]  lg:text-[14px]">{subItem.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link to={item.path} className={`flex flex-row space-x-2 items-center p-2 rounded-lg  ${item.path === window.location.pathname ? 'bg-green-600' : ''}`}>
            {item.icon}
            <span className="flex  text-xs lg:text-sm">{item.title}</span>
          </Link>
        )}
      </div>
    );
  };