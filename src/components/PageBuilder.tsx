import { ReactNode, useEffect, useState } from "react";
import { Header } from "./ui/header";
import { SideBar, SideBarSM } from "./ui/Sidebar";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
} from "./ui/card";
import {  useNavigate } from "react-router-dom";
import client from "@/axios-config";
import useAuth from "@/context/AuthContext";

type PageBuilderProps = {
  mainContent: ReactNode;
};

export const PageBuilder = ({ mainContent }: PageBuilderProps) => {
  const [open, setOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const {loggedIn, setLoggedIn, role,  setRole} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Path changed to:!", window.location.pathname)
    console.log("loggedIn? ", loggedIn)
    console.log("role? ", role)
  },
  [window.location.pathname]);

  useEffect(() => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + "csrftoken" + '\\s*=\\s*([^;]+)');
    const csrftoken = cookieValue ? cookieValue.pop() : ''
    client.defaults.headers.post['X-CSRFToken'] = csrftoken;
    client.defaults.headers.put['X-CSRFToken'] = csrftoken;
    client.defaults.headers.delete['X-CSRFToken'] = csrftoken;
  }, [loggedIn])

  const handleLogout = async () => {
    try{
      const response = await client.post("userapi/logout", {withCredentials: true})

      if (response.status === 200) {
        setLoggedIn(false)
        setRole("")
        navigate('/')
      }
    }
    catch(error){
      console.log("Error on logout request!",  error)
    }
  }

  return (
    <div className={`relative h-screen`}>
      {logoutDialog && (
        <div className="absolute z-10 inset-0 flex pt-48 justify-center bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10">
          <div className=" w-4/5 h-36 md:w-3/5 lg:w-2/5 lg:h-40">
            <Card className="">
              <CardHeader>
                <h1 className="lg:text-xl font-semibold">Do you want to logout?</h1>
                <CardDescription className="text-xs lg:text-base">
                  Are you sure you want to logout?{" "}
                </CardDescription>
              </CardHeader>
              <div className="flex justify-end gap-3 pr-6 mb-5">
                <Button className="w-16 h-8 lg:w-20 lg:h-10" onClick={() => setLogoutDialog(false)}>
                  <p className="text-xs font-light lg:text-sm">Cancel</p>
                </Button>
                <Button variant="destructive" className="w-16 h-8 lg:w-20 lg:h-10" onClick={handleLogout}>
                  <p className="text-xs font-light lg:text-sm">Logout</p>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
      <div className={`grid z-0 grid-cols-12 grid-rows-12 h-full`}>
        <div
          className={` col-span-11 col-start-2 row-start-1 stick  flex items-center justify-end  ${
            open ? "hidden" : "block"
          } sm:col-span-10 col-start-3 row-start-1`}
        >
          <Header toggleLogout={() => setLogoutDialog(true)} />
        </div>

        {/* For larger screens */}
        {!logoutDialog && (
          <div
          className={`hidden  row-span-12 col-start-1 row-start-1 sm:block col-span-2`}
        >
          <SideBar />
        </div>
        )}
        

        {/* For smaller screens */}
        <div
          className={`col-start-1 row-start-1   ${
            open ? "row-span-12 col-span-9" : "col-span-2 justify-center items-center"
          } sm:hidden`}
        >
          <SideBarSM
            open={open}
            setOpen={() => {
              setOpen(!open);
            }}
          />
        </div>

        <div
          className={`overflow-scroll col-span-12 row-span-11 row-start-2 col-start-1 ${
            open ? "hidden" : "block"
          } sm:col-start-3`}
        >
          {/* All the components go here */}
          {mainContent}
        </div>
      </div>
    </div>
  );
};
