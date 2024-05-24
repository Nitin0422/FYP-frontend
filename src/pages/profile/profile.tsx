import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useAuth from "@/context/AuthContext";
import { useUser } from "@/hooks/useUser";
import User from "@/model/user";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import client from "@/axios-config";
import {
  FORGOT_PASSWORD,
  GET_DOCTOR_BY_ID,
  GET_DOCTOR_ID,
  GET_LOGGEDIN_PATIENT_ID,
  GET_PATIENT_BY_ID,
} from "@/constants/API";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DoctorData } from "../admin/users/doctors/doctors";
import { DoctorForm } from "../admin/users/doctors/doctor-form";
import { PatientData } from "../admin/users/patients/patients";
import { PatientForm } from "../admin/users/patients/patient-form";

const ProfileContent = () => {
  const navigate = useNavigate();
  const { role, loggedIn, setLoggedIn, setRole } = useAuth();
  const [user, setUser] = useState<User | null>();
  const [open, setOpen] = useState(false);
  const [docID, setDocID] = useState(0);
  const [doctor, setDoctor] = useState<DoctorData | null>();
  const [pID, setPID] = useState(0);
  const [patient, setPatient] = useState<PatientData | null>();

  const [fName, setFName] = useState("");
  const [pwd, setPwd] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [age, setAge] = useState(0);
  const [bloodGroup, setBloodGroup] = useState("");
  const [chronicDisease, setChronicDisease] = useState("");

  const [updateRequest, setUpdateRequest] = useState(true);
  const [fetchData, setFetchData] = useState(true);

  function UpdateDoctorHandler() {
    setUpdateRequest(true);
    setFName(doctor?.full_name ?? "");
    setAddress(doctor?.address ?? "");
    setPhoneNumber(doctor?.phone_number ?? "");
    setQualification(doctor?.qualification ?? "");
    setGender(doctor?.gender ?? "");
    setDepartment(doctor?.department ?? "");
  }
  function UpdatePatientHandler() {
    setUpdateRequest(true);
    setFName(patient?.full_name ?? "");
    setAddress(patient?.address ?? "");
    setPhoneNumber(patient?.phone_number ?? "");
    setGender(patient?.gender ?? "");
    setAge(patient?.age ?? 0);
    setBloodGroup(patient?.blood_group ?? "");
    setChronicDisease(patient?.chronic_disease ?? "");
  }

  async function getUserData() {
    try {
      const userData = await useUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    getUserData();
    client
      .get(GET_DOCTOR_ID)
      .then((response) => {
        setDocID(response.data);
        setFetchData(true);
      })
      .catch((error) => {
        console.log("Error fetching doctor data", error);
      });
    client.get(GET_LOGGEDIN_PATIENT_ID).then((response) => {
      setPID(response.data);
      setFetchData(true);
    });
  }, []);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_PATIENT_BY_ID + pID)
        .then((response) => {
          setPatient(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error fetching patient data", error);
        });
      setFetchData(false);
    }
  }, [pID, fetchData]);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_DOCTOR_BY_ID + docID)
        .then((response) => {
          setDoctor(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error fetching doctor data", error);
        });
      setFetchData(false);
    }
  }, [docID, fetchData]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function clearForm() {
    setEmail("");
    setPassword("");
    setPassword2("");
  }
  const handleLogout = async () => {
    try {
      const response = await client.post("userapi/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setLoggedIn(false);
        setRole("");
        navigate("/");
      }
    } catch (error) {
      console.log("Error on logout request!", error);
    }
  };
  const submitRequest = async () => {
    if (password !== password2) {
      toast.error("Password do not match");
      return;
    }
    client
      .put(FORGOT_PASSWORD, { email: email, password: password })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Password changed successfully");
          clearForm();
          setTimeout(() => {
            handleLogout();
            window.location.reload();
          }, 700);
        }
      })
      .catch(() => {
        toast.error("Error changing password");
      });
  };

  return (
    <div className="flex flex-col justify-center h-full pb-11">
      <div className="flex flex-row-reverse p-2">
        {/* <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button> */}
      </div>
      <div className=" p-5 flex justify-center">
        <Card className="sm:w-4/6 lg:w-1/2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your Information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-5">
            <div className="text-sm col-span-2">
              <p className="pb-3">Email:</p>
              {role === "doctor" && (
                <>
                  <p className="pb-3">Full Name:</p>
                  <p className="pb-3">Phone Number:</p>
                  <p className="pb-3">Address:</p>
                  <p className="pb-3">Gender:</p>
                  <p className="pb-3">Department:</p>
                </>
              )}
              {role === "patient" && (
                <>
                  <p className="pb-3">Full Name:</p>
                  <p className="pb-3">Phone Number:</p>
                  <p className="pb-3">Address:</p>
                  <p className="pb-3">Gender:</p>
                  <p className="pb-3">Age:</p>
                  <p className="pb-3">Blood Group:</p>
                  <p className="pb-3">Chronic Disease:</p>
                </>
              )}
              <p className="pb-3">Account Type:</p>
            </div>
            <div className="values col-span-3  text-muted-foreground text-sm">
              <p className="pb-3">{user?.email || "---"}</p>
              {role === "doctor" && (
                <>
                  <p className="pb-3">{doctor?.full_name}</p>
                  <p className="pb-3">{doctor?.phone_number}</p>
                  <p className="pb-3">{doctor?.address}</p>
                  <p className="pb-3">{doctor?.gender}</p>
                  <p className="pb-3">{doctor?.department}</p>
                </>
              )}
              {role === "patient" && (
                <>
                  <p className="pb-3">{patient?.full_name}</p>
                  <p className="pb-3">{patient?.phone_number}</p>
                  <p className="pb-3">{patient?.address}</p>
                  <p className="pb-3">{patient?.gender}</p>
                  <p className="pb-3">{patient?.age}</p>
                  <p className="pb-3">{patient?.blood_group}</p>
                  <p className="pb-3">{patient?.chronic_disease}</p>
                </>
              )}
              <p className="pb-3">{user?.groups?.[0] ?? "---"}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {role === "doctor" && (
              <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogTrigger>
                  {" "}
                  <Button
                    className=" text-sm bg-green-500 rounded-lg p-2"
                    onClick={() => UpdateDoctorHandler()}
                  >
                    {" "}
                    Edit Profile{" "}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DoctorForm
                    email={email}
                    setEmail={setEmail}
                    pwd={pwd}
                    setPwd={setPwd}
                    fName={fName}
                    setFName={setFName}
                    address={address}
                    setAddress={setAddress}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    qualification={qualification}
                    setQualification={setQualification}
                    gender={gender}
                    setGender={setGender}
                    department={department}
                    setDepartment={setDepartment}
                    updateRequest={updateRequest}
                    setOpen={() => setOpen(!open)}
                    id={docID}
                    setFetchData={setFetchData}
                    clearForm={clearForm}
                  />
                </DialogContent>
              </Dialog>
            )}

            {role === "patient" && (
              <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogTrigger>
                  {" "}
                  <Button
                    className=" text-sm bg-green-500 rounded-lg p-2"
                    onClick={() => UpdatePatientHandler()}
                  >
                    {" "}
                    Edit Profile
                  </Button>{" "}
                </DialogTrigger>
                <DialogContent>
                  <PatientForm
                    email={email}
                    setEmail={setEmail}
                    pwd={pwd}
                    setPwd={setPwd}
                    fName={fName}
                    setFName={setFName}
                    age={age}
                    setAge={setAge}
                    gender={gender}
                    setGender={setGender}
                    bloodGroup={bloodGroup}
                    setBloodGroup={setBloodGroup}
                    address={address}
                    setAddress={setAddress}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    chronicDisease={chronicDisease}
                    setChronicDisease={setChronicDisease}
                    updateRequest={updateRequest}
                    setFetchData={setFetchData}
                    setOpen={() => setOpen(!open)}
                    id={pID}
                    user_id={user?.id ?? 0}
                    open={open}
                    setUpdateRequest={setUpdateRequest}
                    ClearForm={clearForm}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Dialog>
              <DialogTrigger >
                <Button className="bg-green-500 rounded-lg p-2 text-sm"> Change Password</Button>    
              </DialogTrigger>
              <DialogContent>
                <div className="w-[330px] sm:w-[450px]">
                  <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                      Enter email and new password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid w-full gap-4">
                      {!!!loggedIn && (
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
                      )}

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
                      disabled={password2 === "" || password === ""}
                      onClick={submitRequest}
                    >
                      Change Password
                    </Button>
                  </CardFooter>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Toaster position="top-right" theme="system" richColors />
      </div>
    </div>
  );
};

export const Profile = () => {
  return <PageBuilder mainContent={<ProfileContent />} />;
};
