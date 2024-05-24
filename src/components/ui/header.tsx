import { LogOut } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

interface HeaderProps{
    toggleLogout: () => void
}

export const Header = ({toggleLogout} : HeaderProps) => {

  return (
    <div className="w-16 flex items-center justify-start gap-5 mr-2 ">
        <div className="">
      <ModeToggle />
      </div>
      <div className="h-8 flex items-center ">
      <LogOut className="h-5 w-5" onClick={toggleLogout}/>
      </div>
    </div>
  );
};
