import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { PatientForm } from "./patient-form";
import { GET_PATIENT, GET_PATIENT_BY_ID } from "@/constants/API";
import useAuth from "@/context/AuthContext";
import { Toaster, toast } from "sonner";

export type PatientData = {
  id: number;
  user_id: number;
  full_name: string;
  age: number;
  gender: string;
  blood_group: string;
  address: string;
  phone_number: string;
  chronic_disease: string;
};

const UserPatientsContent = () => {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [id, setID] = useState(0);
  const [user_id, setUserID] = useState(0);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [fName, setFName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chronicDisease, setChronicDisease] = useState("");

  const [fetchData, setFetchData] = useState(true);
  const [updateRequest, setUpdateRequest] = useState(false);

  const [patientList, setPatientList] = useState<PatientData[]>([]);

  async function getPatient() {
    const response = await client.get(GET_PATIENT);
    if (response.status === 200) {
      setPatientList(response.data);
    }
  }

  useEffect(() => {
    if (fetchData) {
      getPatient();
      setFetchData(false);
    }
  }, [fetchData]);

  const patientColumns: ColumnDef<PatientData>[] = [
    {
      accessorKey: "user_id",
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
            Patient ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <Button
            className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Age
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "blood_group",
      header: ({ column }) => {
        return (
          <Button
            className=" text-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Blood Group
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "chronic_disease",
      header: "Chronic Disease",
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: (cellContext) => {
        const row = cellContext.row.original;
        return (
          <div className="flex flex-row gap-2 pl-3 items-center justify-center z-1">
            <Button
              className="w-16 text-xs h-8 rounded-sm bg-yellow-600 hover:bg-yellow-700"
              onClick={() => UpdatePatientHandler(row.id)}
            >
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-16 text-xs h-8 rounded-sm hover:bg-red-700"
                  variant="destructive"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent
                className={
                  "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                }
              >
                <div className="">
                  <div className="r">
                    <h1 className="text-base font-light sm:text-lg">
                      Do you want to delete this record?
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
                      onClick={() => DeletePatient(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const filteredColumns =
    role === "admin"
      ? patientColumns
      : patientColumns.filter((column) => column.id !== "actions");

  // Define the update and delete handlers
  const UpdatePatientHandler = (id: number) => {
    const url = GET_PATIENT_BY_ID + id;
    client
      .get(url)
      .then(function (res) {
        setUpdateRequest(true);
        setUserID(res.data.user_id);
        setFName(res.data.full_name);
        setAge(res.data.age);
        setPhoneNumber(res.data.phone_number);
        setAddress(res.data.address);
        setChronicDisease(res.data.chronic_disease);
        setGender(res.data.gender);
        setBloodGroup(res.data.blood_group);
        setID(res.data.id);
        setOpen(true);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const DeletePatient = (id: number) => {
    const url = GET_PATIENT_BY_ID + id;
    client
      .delete(url)
      .then(function () {
        setFetchData(true);
        toast.success("Patient deleted");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Patient not deleted");
      });
  };
  function ClearForm() {
    setEmail("");
    setPwd("");
    setFName("");
    setAge(0);
    setPhoneNumber("");
    setAddress("");
    setChronicDisease("");
    setGender("");
    setBloodGroup("");
  }

  function CloseDialog() {
    if (open) {
      setOpen(false);
      ClearForm();
    } else {
      setOpen(true);
      setUpdateRequest(false);
    }
  }

  return (
    <div className="mx-3 lg:mx-6">
      <div className="header flex justify-between items-center">
        <span className="text-lg font-semibold sm:text-xl"> Patients</span>
        {role === "admin" ? (
          <Dialog open={open} onOpenChange={CloseDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-xs h-8 md:text-sm md:h-full"
              >
                <Plus className="mr-2 h-3 w-3" /> Add Patients
              </Button>
            </DialogTrigger>
            <DialogContent
              className={
                "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
              }
            >
              <>
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
                  id={id}
                  user_id={user_id}
                  open={open}
                  setUpdateRequest={setUpdateRequest}
                  ClearForm={ClearForm}
                />
              </>
            </DialogContent>
          </Dialog>
        ) : (
          <></>
        )}
      </div>
      <div>
        <DataTable
          // key={JSON.stringify(doctorList)}
          columns={filteredColumns}
          data={patientList}
        />
      </div>
      <Toaster position="top-right" theme="system" richColors />
    </div>
  );
};

function UserPatientPage() {
  // const [open, setOpen] = useState(false);

  return <PageBuilder mainContent={<UserPatientsContent />} />;
}

export default UserPatientPage;
