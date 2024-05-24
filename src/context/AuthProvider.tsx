import React, { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { Spinner } from "@/components/ui/spinner";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null); // Use null as initial value
  const [role, setRole] = useState<string | null>(null); // Use null as initial value

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await useCurrentUser();
        if (user !== null) {
          setLoggedIn(true);
          setRole(user.groups? user.groups[0] : "");
        } else {
          setLoggedIn(false);
          setRole("None");
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching user data:", error);
        setLoggedIn(false); // Set to false in case of error
        setRole("None"); // Set to 'None' in case of error
      }
    }
    fetchData();
    // You can add dependencies if needed
  }, [window.location.pathname]);

  // Render loading state until data is fetched
  if (loggedIn === null || role === null) {
    return (
      <div className="h-screen w- screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ loggedIn, role, setLoggedIn, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
