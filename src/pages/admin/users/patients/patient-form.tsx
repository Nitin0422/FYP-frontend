import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@radix-ui/react-select";
import client from "@/axios-config";
import { useEffect } from "react";
import { ADD_PATIENT, GET_PATIENT_BY_ID } from "@/constants/API";
import { toast } from "sonner";

interface PatientFormProps {
  email: string;
  setEmail: (email: string) => void;
  pwd: string;
  setPwd: (pwd: string) => void;
  fName: string;
  setFName: (fName: string) => void;
  age: number;
  setAge: (age: number) => void;
  gender: string;
  setGender: (gender: string) => void;
  bloodGroup: string;
  setBloodGroup: (bloodGroup: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  chronicDisease: string;
  setChronicDisease: (chronicDisease: string) => void;
  updateRequest: boolean;
  setUpdateRequest: (updateRequest:boolean) => void;
  open: boolean;
  setOpen: () => void;
  setFetchData: (fetchData: boolean) => void;
  id: number;
  user_id: number;
  ClearForm: () => void
}

export const PatientForm = ({
  age,
  fName,
  email,
  setEmail,
  pwd,
  setPwd,
  setAge,
  updateRequest,
  setFName,
  gender,
  setGender,
  bloodGroup,
  setBloodGroup,
  address,
  setAddress,
  chronicDisease,
  setChronicDisease,
  phoneNumber,
  setPhoneNumber,
  setFetchData,
  setOpen,
  id,
  user_id,
  open,
  ClearForm
}: PatientFormProps) => {

   
    useEffect(() => {
      if (!open){
        ClearForm()

      }else{
        
      }
    }, [open])

    function AddPatient() {
        const user_data = {
            email : email,
            password : pwd
        }
        const patient_data ={
            full_name: fName,
            age: age,
            blood_group: bloodGroup,
            address: address,
            gender:gender,
            phone_number: phoneNumber,
            chronic_disease: chronicDisease
        }
        client.post(ADD_PATIENT, {
            user_data: user_data,
            patient_data: patient_data
        }).then(function(){
            setOpen()
            setFetchData(true)
            ClearForm()
            toast.success("Patient added successfully")
        }).catch(function(err){
            console.log(err);
            toast.error("Patient not added")
        })
    }
    function UpdatePatient(id:number){
      const url = GET_PATIENT_BY_ID + id
      client.put(url, {
        user_id: user_id,
        full_name: fName,
        age: age,
        blood_group: bloodGroup,
        address: address,
        gender:gender,
        phone_number: phoneNumber,
        chronic_disease: chronicDisease
      }, {
        withCredentials: true
      }).then(function(){
        ClearForm()
        setOpen()
        setFetchData(true);
        toast.success("Patient updated successfully")
      }).catch(function(err){
        console.log(err);
        toast.error("Patient not updated")
      })
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
              type="email"
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
        <Label htmlFor="fullName" className="">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fName}
          onChange={(e) => {
            setFName(e.target.value);
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="age" className="">
          Age
        </Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => {
            setAge(Number(e.target.value));
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
        <Label htmlFor="chronicDisease" className="">
        Chronic Disease
        </Label>
        <Input
          id="chronicDisease"
          type="text"
          value={chronicDisease}
          onChange={(e) => {
            setChronicDisease(e.target.value);
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
          <Label htmlFor="bloodGroup" className="">
            Blood Group
          </Label>

          <Select value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger className="w-[125px] flex justify-between items-center rounded-lg border p-2  sm:w-[150px] md:w-[200px]">
              {bloodGroup || "Select Blood Group"}{" "}
              <ChevronDown size={10}></ChevronDown>
            </SelectTrigger>

            <SelectContent className="w-[125px] h-[120px] overflow-scroll  p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[150px] md:w-[200px]">
            <SelectItem value="O+" className="py-2">
                O+
              </SelectItem>
              <SelectItem value="B+" className="py-2">
                B+
              </SelectItem>
              <SelectItem value="A+" className="py-2">
                A+
              </SelectItem>
              <SelectItem value="AB+" className="py-2">
                AB+
              </SelectItem>
              <SelectItem value="O-" className="py-2">
                O-
              </SelectItem>
              <SelectItem value="B-" className="py-2">
                B-
              </SelectItem>
              <SelectItem value="A-" className="py-2">
                A-
              </SelectItem>
              <SelectItem value="AB-" className="py-2">
                AB-
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-100 flex justify-end">
        {updateRequest ? (
          <Button className=" w-2/6 " onClick={() => UpdatePatient(id)}>
            {" "}
            Update{" "}
          </Button>
        ) : (
          <Button className=" w-2/6 " onClick={AddPatient}>
            {" "}
            Add{" "}
          </Button>
        )}
      </div>

    </div>
  );
};
