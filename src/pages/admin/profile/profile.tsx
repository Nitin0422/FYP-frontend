import Sidenav from "@/components/ui/sidenav";
import { useState } from "react";

const AdminProfile = () => {
    const [open, setOpen] = useState(true);
        
      return (
        <div className="flex">
            <Sidenav open={open} setOpen = {() => {setOpen(!open)}}/>
            <div className={`${open ? "hidden sm:block" : ""}`}>
                <h1> This will be the Admin profile page</h1>
            </div>
        </div>
        
      );
}
export default AdminProfile;