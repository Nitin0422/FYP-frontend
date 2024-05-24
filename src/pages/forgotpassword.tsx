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
import { FORGOT_PASSWORD } from "@/constants/API";
import useAuth from "@/context/AuthContext";


function ForgotPassword() {
  const navigate = useNavigate()
  const {loggedIn} = useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");


  function clearForm() {
    setEmail("");
    setPassword("");
    setPassword2("");
  }


  const  submitRequest = async () => {
    if (password !== password2) {
      toast.error("Password do not match");
      return;
    }
    client.put(FORGOT_PASSWORD, {email: email, password: password}).then((response) => {
      if (response.status === 200) {
        toast.success("Password changed successfully");
        clearForm();
        setTimeout(() => {
            navigate('/');
          }, 700);
      }
    }).catch(() => {
      toast.error("Error changing password");
    })
  }


  return (
    <div className="flex flex-col  h-screen">
      <div className="w-100 flex flex-row-reverse">
        <div className="w-16 m-3
        sm:w-20">
          <ModeToggle />
        </div>
      </div>
      <div className="w-full  h-full flex justify-center items-center pb-16">
      <Card className="w-[330px] sm:w-[450px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter email and new password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            {(!!!loggedIn) && <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>}

            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password1">Password</Label>
              <PasswordInput
                id="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="password2">Confirm Password</Label>
              <PasswordInput
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-3 ">
            <Button
              className="w-full"
              disabled={email === "" || password === ""}
              onClick={submitRequest}
            >
              Change Password
            </Button>
            <Link to="/" className="w-full text-xs text-right text-green-500 hover:text-green-600 underline"> Login? </Link>
          </CardFooter>
          <Toaster position="top-right" theme="system" richColors />
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
