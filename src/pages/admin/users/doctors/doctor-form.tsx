import client from "@/axios-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ADD_DOCTOR, GET_DEPARTMENT, UPDATE_DOCTOR } from "@/constants/API";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DoctorFormProps {
  email: string;
  setEmail: (email: string) => void;
  pwd: string;
  setPwd: (pwd: string) => void;
  fName: string;
  setFName: (fName: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  qualification: string;
  setQualification: (qualification: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  updateRequest: boolean;
  setOpen: () => void;
  id: number;
  setFetchData: (fetchData: boolean) => void;
  clearForm: () => void;
}

export const DoctorForm = ({
  email,
  setEmail,
  pwd,
  setPwd,
  fName,
  setFName,
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
  qualification,
  setQualification,
  gender,
  setGender,
  department,
  setDepartment,
  updateRequest,
  setOpen,
  id,
  setFetchData,
  clearForm
}: DoctorFormProps) => {
  const [departmentList, setDepartmentList] = useState<
    Department[] | undefined
  >();

  useEffect(() => {
    client
      .get(GET_DEPARTMENT)
      .then(function (res) {
        setDepartmentList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  

  function AddDoctor() {
    const user_data = {
      email: email,
      password: pwd,
    };
    const doctor_data = {
      address: address,
      phone_number: phoneNumber,
      full_name: fName,
      department: department,
      gender: gender,
      qualification: qualification,
    };
    console.log(user_data);
    console.log(doctor_data);
    client
      .post(ADD_DOCTOR, {
        user_data: user_data,
        doctor_data: doctor_data,
      })
      .then(function (res) {
        console.log(res);
        clearForm();
        setOpen();
        setFetchData(true)
        toast.success("Doctor added");
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Doctor not added");
      });
  }

  function UpdateDoctor(id: number) {
    const url = UPDATE_DOCTOR + id;
    client
      .put(url, {
        "address": address,
        "phone_number": phoneNumber,
        "full_name": fName,
        "department": department,
        "gender": gender,
        "qualification": qualification
      })
      .then(function (res) {
        console.log(res);
        clearForm();
        setOpen();
        setFetchData(true);
        toast.success("Doctor updated");
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Doctor not updated");
      });
  }

  return (
    <div className="grid w-full gap-4 text-sm lg:text-base">
      {!!!updateRequest ? (
        <>
          <div className="flex flex-col items-start space-y-2 text-sm">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col items-start space-y-2 text-sm">
            <Label htmlFor="pwd" className="">
              Password
            </Label>
            <PasswordInput
              id="pwd"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
              }}
              autoComplete="off"
            />
          </div>
        </>
      ) : (
        <></>
      )}

      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="name" className="">
          Doctor Name
        </Label>
        <Input
          id="name"
          type="text"
          value={fName}
          onChange={(e) => {
            setFName(e.target.value);
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="address" className="">
          Address
        </Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="phoneNumber" className="">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="qualification" className="">
          Qualification
        </Label>
        <Input
          id="name"
          type="text"
          value={qualification}
          onChange={(e) => {
            setQualification(e.target.value);
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-9">
        <div className="flex flex-col items-start space-y-2 text-sm ">
          <Label htmlFor="gender" className="">
            Gender
          </Label>

          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[125px] flex justify-between items-center rounded-lg border p-2 sm:w-[150px] md:w-[200px]">
              {gender || "Select gender"} <ChevronDown size={10}></ChevronDown>
            </SelectTrigger>
            <SelectContent className=" w-[125px] p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[150px] md:w-[200px]">
              <SelectItem value="Male" className="py-2">
                Male
              </SelectItem>
              <SelectItem value="Female" className="py-2">
                Female
              </SelectItem>
              <SelectItem value="Others" className="py-2">
                Others
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start space-y-2 text-sm ">
          <Label htmlFor="department" className="">
            Department
          </Label>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[125px] flex justify-between items-center rounded-lg border p-2  sm:w-[150px] md:w-[200px]">
              {department || "Select department"}{" "}
              <ChevronDown size={10}></ChevronDown>
            </SelectTrigger>

            <SelectContent className="w-[125px] h-[120px] overflow-scroll  p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[150px] md:w-[200px]">
              {departmentList?.map((department) => (
                <SelectItem
                  key={department.id}
                  value={department.department_name}
                  className="py-2"
                >
                  {department.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-100 flex justify-end">
        {updateRequest ? (
          <Button className=" w-2/6 " onClick={() => UpdateDoctor(id)}>
            {" "}
            Update{" "}
          </Button>
        ) : (
          <Button className=" w-2/6 " onClick={AddDoctor}>
            {" "}
            Add{" "}
          </Button>
        )}
      </div>
    </div>
  );
};
