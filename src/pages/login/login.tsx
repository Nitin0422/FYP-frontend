import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Toaster, toast } from "sonner";
import client from "@/axios-config";
import { ModeToggle } from "@/components/mode-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LOGIN } from "@/constants/API";

function Login() {
  const { setLoggedIn, setRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function clearForm() {
    setEmail("");
    setPassword("");
  }

  const submitLogin = async () => {
    try {
      const response = await client.post(LOGIN, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        console.log("Logged In:", response.data);
        setLoggedIn(true);
        setRole(response.data.role);
        const sessionId = localStorage.getItem("sessionid");
        client.defaults.headers.common["Authorization"] = `Bearer ${sessionId}`;

        switch (response.data.role) {
          case "admin":
            navigate("/admin/home");
            break;
          case "doctor":
            navigate("/doctor/home");
            break;
          case "patient":
            navigate("/patient/home");
            break;
          default:
            navigate("/home");
        }
      }
    } catch (error) {
      toast.error("Please provide valid username and password");
      clearForm();
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col  h-screen">
      <div className="w-100 flex flex-row-reverse">
        <div
          className="w-16 m-3
        sm:w-20"
        >
          <ModeToggle />
        </div>
      </div>
      <div className="w-full  h-full flex justify-center items-center pb-16">
        <Card className="w-[330px] sm:w-[450px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login with the credentials provided
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="password1">Password</Label>
                <PasswordInput
                  id="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-3 ">
            <Button
              className="w-full"
              disabled={email === "" || password === ""}
              onClick={submitLogin}
            >
              Login
            </Button>
            <Link
              to="/forgotpassword"
              className="w-full text-xs text-right text-green-500 hover:text-green-600 underline"
            >
              {" "}
              Forgot Password?{" "}
            </Link>
          </CardFooter>
          <Toaster position="top-right" theme="system" richColors />
        </Card>
      </div>
    </div>
  );
}

export default Login;
