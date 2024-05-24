import { useState, useEffect } from "react";

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
import { Toaster, toast } from 'sonner';
import client from "@/axios-config";



function Register() {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        isValidEmail()
    }, [email])

    useEffect(() => {
        checkPassword()
    }, [password2])

  

    function clearForm(){
        setEmail('');
        setPassword1('');
        setPassword2('');
    }
    function isValidEmail() {
        // Define a regular expression pattern for email validation.
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !pattern.test(email)) {
            setEmailError('Invalid email format')
        }
        else{
            setEmailError('')
        }
    }

    function checkPassword(){
        if (password1 != password2){
            setPasswordError("Passwords do not match")
        }
        else{
            setPasswordError("")
        }
    }
    function submitRegistration(e: Event){
        e.preventDefault();
        client.post(
            "/userapi/register",
            {
                email: email,
                password: password1,
            }
        ).then(function(){
            toast.success('Registration successful!', {duration: 3000})
            clearForm();
        }).catch(function() {
            toast.error('Something went wrong! ', {duration: 3000})
            clearForm();
        });
    }
    

    //Return template
    return (
     
                <div className="flex justify-center items-center" style={{ height: "calc(100vh - 150px)" }}>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Patient Registration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="flex flex-col items-start space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
                  {emailError && <small className="pl-1" style={{ color: 'red' }}>{emailError}</small>}
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <Label htmlFor="password1">Password</Label>
                  <PasswordInput id="password1" value={password1} onChange={e => setPassword1(e.target.value)} />
                  {passwordError && <small className="pl-1" style={{ color: 'red' }}>{passwordError}</small>}
                </div>

                <div className="flex flex-col items-start space-y-2">
                  <Label htmlFor="password2"> Confirm Password</Label>
                  <PasswordInput id="password2" value={password2} onChange={e => {setPassword2(e.target.value)}} />
                  {passwordError && <small className="pl-1" style={{ color: 'red' }}>{passwordError}</small>}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={passwordError !== "" || emailError !== ""} onClick={e => submitRegistration(e)}>Register</Button>
            </CardFooter>
            
            <Toaster position="top-right"  theme="system" richColors/>
          </Card>
        </div>
        
      );
}

export default Register;
