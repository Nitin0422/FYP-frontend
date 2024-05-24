import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useAuth from "@/context/AuthContext";
import { useEffect } from "react";


interface RequireAuthProps {
  allowedRoles: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { loggedIn, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    } else if (loggedIn && role != null && allowedRoles.includes(role)) {
      console.log(role);
      console.log(allowedRoles);
    } else if (loggedIn && role != null && !allowedRoles.includes(role)) {
      navigate(-1);
    } else {
      console.log("KEI NE VAYENMA");
      console.log(allowedRoles);
      console.log(role);
    }
    
  });

  return <Outlet />;
};
