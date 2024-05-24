import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DoctorForm } from "./doctor-form";
import client from "@/axios-config";

import { DataTable } from "./datatable";
import { ColumnDef } from "@tanstack/react-table";
import { DELETE_DOCTOR, GET_DOCTORS, GET_DOCTOR_BY_ID } from "@/constants/API";
import useAuth from "@/context/AuthContext";
import { Toaster, toast } from "sonner";

export type DoctorData = {
  id: number;
  doctor: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  department: string;
  qualification: string;
  gender: string;
};

const UserDoctorsContent = () => {
  const {role} = useAuth()
  const [email, setEmail] = useState("");
  const [id, setID] = useState(0);
  const [pwd, setPwd] = useState("");
  const [fName, setFName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [updateRequest, setUpdateRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchData, setFetchData] = useState(true);

  const [doctorList, setDoctorList] = useState<Doctor[]>();

  async function getDoctors() {
    try {
      const response = await client.get(GET_DOCTORS);
      setDoctorList([...response.data]); 
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    if(fetchData){
        getDoctors();
        console.log(doctorList)
        setFetchData(false)
    }
  }, [fetchData]);
  

  function UpdateDoctorHandler(id: number) {
    const url = GET_DOCTOR_BY_ID + id;
    client
      .get(url)
      .then(function (res) {
        setUpdateRequest(true)
        setID(id);
        console.log(res.data);
        setFName(res.data.full_name)
        setAddress(res.data.address)
        setPhoneNumber(res.data.phone_number)
        setQualification(res.data.qualification)
        setGender(res.data.gender)
        setDepartment(res.data.department)
        setOpen(true)
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function DeleteDoctor(userID:number){
    const url = DELETE_DOCTOR + userID
    client.delete(url).then(function(res){
      console.log(res);
      setFetchData(true)
      toast.success("Doctor deleted")
    }).catch(function(err){
      console.log(err);
      toast.error("Error deleting doctor")
    })
  }

  const doctorColumns: ColumnDef<Doctor>[] = [
    {
      accessorKey: "doctor",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
             Doctor ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "department",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "qualification",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qualification
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => {
        return (
          <Button
          className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gender
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center"> Actions </div>,
      cell: (cellContext) => {
        const row = cellContext.row.original;
        return (
          <div className=" flex flex-row gap-2 pl-3 items-center justify-center z-1">
            <Button
              className="w-16 text-xs h-8 rounded-sm bg-yellow-600 hover:bg-yellow-700"
              onClick={() => UpdateDoctorHandler(row.id)}
            >
              {" "}
              Edit{" "}
            </Button>

            <Dialog >
                        <DialogTrigger asChild>
                        <Button
              className="w-16 text-xs h-8 rounded-sm hover:bg-red-700"
              variant="destructive"
              
            >
              {" "}
              Delete{" "}
            </Button>
                        </DialogTrigger>
                        <DialogContent
                          className={
                            "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                          }
                        >
                          <div className=" ">
                            <div className="r">
                              <h1 className="text-base font-light sm:text-lg">
                                Do you want to delete this record?{" "}
                              </h1>
                              <p className="text-[10px] font-light text-red-700 mt-1 sm:text-xs">
                                Record once deleted cannot be retrieved
                              </p>
                            </div>
                            <div className="flex w-full justify-end mt-2">
                              <Button
                                variant="destructive"
                                className="w-16 h-9"
                                type="submit"
                                onClick={() => DeleteDoctor(row.doctor)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>


            {/* <Button
              className="w-16 text-xs h-8 rounded-sm hover:bg-red-700"
              variant="destructive"
              onClick={() => DeleteDoctor(row.doctor)}
            >
              {" "}
              Delete{" "}
            </Button> */}
          </div>
        );
      },
    },
  ];

  const filteredColumns = role === "admin" ? doctorColumns : doctorColumns.filter(column => column.id !== "actions");

  function clearForm() {
    setEmail("");
    setPwd("");
    setFName("");
    setAddress("");
    setPhoneNumber("");
    setQualification("");
    setGender("");
    setDepartment("");
  }
  function CloseDialog() {
    if (open) {
      setOpen(false)
      clearForm()
    }
    else{
      setOpen(true)
    setUpdateRequest(false)
    }
    
  }
  return (
    <div className="mx-3 lg:mx-6">
      {/* Dialog box div */}
      <div className="header flex justify-between items-center">
        <span className="text-lg font-semibold sm:text2xl"> Doctors</span>
        {(role === "admin") ? <Dialog open={open} onOpenChange={CloseDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-xs h-8 md:text-sm md:h-full"
            >
              <Plus className="mr-2 h-3 w-3" /> Add Doctors
            </Button>
          </DialogTrigger>
          <DialogContent
            className={
              "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
            }
          >
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
              id={id}
              setFetchData = {setFetchData}
              clearForm={clearForm}
            />
          </DialogContent>
        </Dialog> : <></>}
        
      </div>
      {/* Table grid  */}
      <div className="">
        <DataTable
          // key={JSON.stringify(doctorList)}
          columns={filteredColumns}
          data={doctorList ? doctorList : []}
        />
      </div>
      <Toaster theme="system" position="top-right" richColors/>
    </div>
  );
};

function UserDoctorsPage() {
  // const [open, setOpen] = useState(false);

  return <PageBuilder mainContent={<UserDoctorsContent />} />;
}

export default UserDoctorsPage;
