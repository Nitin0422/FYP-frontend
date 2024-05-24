import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  GET_ADD_APPOINTMENT,
  GET_APPTS_BY_DOC,
  GET_BOOKED_SLOTS_BY_PATIENT,
  GET_DEPARTMENT,
  GET_DOCTORS,
  GET_DOCTOR_BY_ID,
  GET_LOGGEDIN_PATIENT_NAME,
  GET_PATIENT,
  GET_PATIENT_BY_NAME,
  GET_TODAYS_APPOINTMENTS_ADMIN,
  GET_TODAYS_APPOINTMENTS_PATIENT,
  GET_UPD_DEL_APPOINTMENT,
} from "@/constants/API";

import { useEffect, useState } from "react";
import { PatientData } from "../users/patients/patients";
import useAuth from "@/context/AuthContext";
import { Toaster, toast } from "sonner";



export type Slot = {
  id: number;
  doctor_id: number;
  doctor_full_name: string;
  date: string;
  time: string;
  slots_available: number;
};

export type SlotInfo = {
  id: number;
  slot_id: number;
  patient: number;
  patient_full_name: string;
  notes: string;
  doctor_id: number;
  doctor_full_name: string;
  date: string;
  time: string;
  slots_available: number;
  previous_appointment: number;
};

const AppointmentContent = () => {
  const {role} = useAuth()
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [patientList, setPatientList] = useState<PatientData[]>([]);
  const [departmentList, setDepartmentList] = useState<
    Department[] | undefined
  >();
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [docObj, setDocObj] = useState<Doctor | undefined>();
  const [slotList, setSlotList] = useState<Slot[]>([]);

  const [bookDialog, setBookDialog] = useState(false);

  const [delDialog, setDelDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const [patient, setPatient] = useState("");
  const [patientID, setPatientID] = useState(0);

  const [slot, setSlot] = useState<Slot>();
  const [note, setNote] = useState("");

  const [appSlotList, setAppSlotList] = useState<SlotInfo[]>([]);

  useEffect(() => {
    client
      .get(GET_PATIENT)
      .then(function (res) {
        setPatientList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });

    client
      .get(GET_DEPARTMENT)
      .then(function (res) {
        setDepartmentList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });

      if (role === "patient") {
        client.get(GET_LOGGEDIN_PATIENT_NAME).then(function(res){
          setPatient(res.data);
        }).catch(function(err){
          console.log(err);
        })  
      }
  }, []);

  useEffect(() => {
    console.log("Role: ", role)
      if (role === "patient") {
        client.get(GET_LOGGEDIN_PATIENT_NAME).then(function(res){
          setPatient(res.data);
        }).catch(function(err){
          console.log(err);
          setPatient("")
        })  
      }
  }, [bookDialog, delDialog]);

  useEffect(() => {
    console.log("Role: ", role)
    if (role === "patient") {
      const booked_url = GET_BOOKED_SLOTS_BY_PATIENT + patientID;
      client.get(booked_url).then(function (res) {
        setAppSlotList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
    }
    else{
      client
    .get(GET_TODAYS_APPOINTMENTS_ADMIN)
    .then(function (res) {
      setAppSlotList(res.data);
    })
    .catch(function (err) {
      console.log(err);
    });
    }
  }, [patientID, delDialog, bookDialog])

  useEffect(() => {
    setDoctorList([]);
    setDoctor("");
    setDocObj(undefined);
    const url = GET_DOCTORS + "/" + department;
    client
      .get(url)
      .then(function (res) {
        setDoctorList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [department]);

  useEffect(() => {
    const docID = doctorList.find((doc) => doc.full_name === doctor);
    if (docID) {
      const url = GET_DOCTOR_BY_ID + docID?.id;
      client
        .get(url)
        .then(function (res) {
          setDocObj(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [doctor]);

  useEffect(() => {
    const url = GET_APPTS_BY_DOC + docObj?.id;
    client
      .get(url)
      .then(function (res) {
        setSlotList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [docObj, delDialog, bookDialog]);

  useEffect(() => {
    setDocObj(undefined);
    setDoctor("");
  }, [delDialog]);

  useEffect(() => {
    const url = GET_PATIENT_BY_NAME + patient;
    client
      .get(url)
      .then(function (res) {
        setPatientID(res.data[0].id);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [patient]);

  function BookAppointment() {
    console.log("Slot: ", slot);  
    client
      .post(GET_ADD_APPOINTMENT, {
        slot_id: slot?.id,
        patient: patientID,
        notes: note,
      })
      .then(function () {
        setSlot(undefined);
        setPatient("");
        setNote("");
        setBookDialog(false);
        toast.success("Appointment booked successfully");
      })
      .catch(function (err) {
        console.log(err);
        setSlot(undefined);
        setPatient("");
        setNote("");
        toast.error("Appointment not booked");
      });
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = appSlotList.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(appSlotList.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  function DeleteAppointment(id: number) {
    const url = GET_UPD_DEL_APPOINTMENT + id;
    client
      .delete(url)
      .then(function (res) {
        console.log(res);
        setDelDialog(false);
        toast.success("Appointment deleted successfully");
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Appointment not deleted");
      });
  }

  return (
    <div className="wrapper p-4">
      <div className="pl-3">
        <span className="text-lg font-semibold sm:text-xl">
          Book an Appointment
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-3 ">
        <div className="p-2">
          <Card className="p-2">
            <div className="w-full p-2 flex flex-col gap-2">
              <Label htmlFor="doctor" className="text-lg">
                {" "}
                Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full flex justify-between items-center rounded-lg border p-2">
                  {department || "Select department"}{" "}
                </SelectTrigger>
                <SelectContent className=" w-[310px] h-[150px] overflow-y-scroll p-2 rounded-lg bg-gray-500 backdrop-filter backdrop-blur-sm bg-opacity-20 sm:w-[400px] md:w-[530px]">
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
            {department && (
              <div className="w-full p-2 flex flex-col gap-2">
                <Label htmlFor="doctor" className="text-lg">
                  {" "}
                  Doctor
                </Label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger className="w-full flex justify-between items-center rounded-lg border p-2">
                    {doctor || "Select doctor"}{" "}
                  </SelectTrigger>
                  <SelectContent className=" w-[310px] h-[150px] overflow-y-scroll p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[400px] md:w-[530px]">
                    {doctorList?.map((doctor) => (
                      <SelectItem
                        key={doctor.id}
                        value={doctor.full_name}
                        className="py-2 cursor-pointer"
                      >
                        {doctor.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </Card>
        </div>
        <div className="p-2 flex flex-col gap-3 lg:grid grid-cols-5 grid-rows-2 ">
          <div className="col-start-1 col-span-2 row-span-2">
            <Card className="h-full w-full ">
              <CardContent className="m-0 p-3 flex flex-col gap-2">
                <span className="text-md font-semibold"> Doctor Details </span>
                {docObj ? (
                  <div className="flex flex-col gap-2">
                    <Card className="p-2 ">
                      <div className="grid grid-cols-6">
                        <div className="text-sm col-span-3 md:col-span-2">
                          <p className="pb-3">Full Name:</p>
                          <p className="pb-3">Department:</p>
                          <p className="pb-3">Qualification:</p>
                          <p className="pb-3">Gender:</p>
                        </div>
                        <div className="values col-span-3  text-muted-foreground text-sm md:col-span-4">
                          <p className="pb-3">{docObj?.full_name || "---"}</p>
                          <p className="pb-3">{docObj?.department || "---"}</p>
                          <p className="pb-3">
                            {docObj?.qualification || "---"}
                          </p>
                          <p className="pb-3">{docObj?.gender || "---"}</p>
                        </div>
                      </div>
                    </Card>
                    <div className="flex flex-col gap-3">
                      <span className="text-md font-semibold">Slots</span>
                      <div className="flex gap-3 mt-2w-full overflow-y-scroll">
                        {slotList
                          ?.filter((slot) => slot.slots_available > 0)
                          .map((slot) => (
                            <Dialog
                              key={slot.id}
                              open={bookDialog}
                              onOpenChange={() => setBookDialog(!bookDialog)}
                            >
                              <DialogTrigger
                                className="flex justify-center items-center min-w-[180px] overflow-y-scroll"
                                onClick={() => setSlot(slot)}
                              >
                                <Card className="text-sm w-full flex justify-center items-center p-2 shadow-inner border-green-600 hover:border-green-400 hover:shadow-lg">
                                  <CardContent className="flex flex-col gap-1 pt-3 w-full justify-center">
                                    <span className="font-semibold">
                                      {slot.date}
                                    </span>
                                    <span className="text-xs ">
                                      Time: {slot.time}
                                    </span>
                                    <span className="text-xs ">
                                      Slots Available: {slot.slots_available}
                                    </span>
                                  </CardContent>
                                </Card>
                              </DialogTrigger>
                              <DialogContent
                                className={
                                  "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                                }
                              >
                                <div className="">
                                  <div className="">
                                    <h1 className="font-semibold sm:text-md">
                                      Book appointment for {slot.date} at{" "}
                                      {slot.time} ?
                                    </h1>
                                    <span className="text-red-500 text-sm italic"> Note: Booked Appointments cannot be edited!!</span>
                                  </div>
                                  <div className="flex flex-col gap-3 w-full mt-4">
                                    {(role !== "patient") ? <div className="flex flex-col gap-2">
                                      <Label>Patient:</Label>
                                      <Select
                                        value={patient}
                                        onValueChange={setPatient}
                                      >
                                        <SelectTrigger className="w-full flex justify-between items-center rounded-lg border p-2">
                                          {patient || "Select patient"}{" "}
                                        </SelectTrigger>
                                        <SelectContent className=" w-[310px] h-[150px] overflow-y-scroll p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[400px] md:w-[530px]">
                                          {patientList?.map((patient) => (
                                            <SelectItem
                                              key={patient.id}
                                              value={patient.full_name}
                                              className="py-2"
                                            >
                                              {patient.full_name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>: <></>}
                                    
                                    <div className="flex flex-col gap-2">
                                      <Label>Notes:</Label>
                                      <Textarea
                                        value={note}
                                        onChange={(e) =>
                                          setNote(e.target.value)
                                        }
                                      ></Textarea>
                                    </div>
                                    <Button
                                      className="w-16 h-9"
                                      type="submit"
                                      onClick={() => BookAppointment()}
                                    >
                                      Book
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Select a doctor
                  </span>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="col-start-3 row-start-1 col-span-3 row-span-2">
            <Card className="h-full w-full">
              <CardContent className="m-0 p-3 flex flex-col gap-2">
                <span className="text-md font-semibold">Todays Appointments</span>
                <Table className="border rounded-3xl">
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead> Date </TableHead>
                      <TableHead> Doctor </TableHead>
                      <TableHead> Patient </TableHead>
                      <TableHead> Time </TableHead>
                      <TableHead> Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {appSlotList.length !== 0 ? (
                      <>
                        {currentPageData.map((slot, index) => (
                          <TableRow key={index}>
                            <TableCell>{slot.date}</TableCell>
                            <TableCell>{slot.doctor_full_name}</TableCell>
                            <TableCell> {slot.patient_full_name} </TableCell>
                            <TableCell>{slot.time}</TableCell>
                            <TableCell>
                              <div className="flex gap-3">
                        
                                <Dialog
                                  open={delDialog}
                                  onOpenChange={() => setDelDialog(!delDialog)}
                                >
                                  <DialogTrigger className="w-16 text-xs h-8 rounded-sm bg-red-500 hover:bg-red-600">
                                    Delete
                                  </DialogTrigger>
                                  <DialogContent
                                    className={
                                      "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                                    }
                                  >
                                    <div className=" ">
                                      <div className="r">
                                        <h1 className="text-base font-light sm:text-lg">
                                          Do you want to delete appointment for{" "}
                                          {slot.patient_full_name} at{" "}
                                          {slot.date} ?
                                        </h1>
                                        <p className="text-[10px] font-light text-red-700 mt-1 sm:text-xs">
                                          Record once deleted cannot be
                                          retrieved
                                        </p>
                                      </div>
                                      <div className="flex w-full justify-end mt-2">
                                        <Button
                                          variant="destructive"
                                          className="w-16 h-9"
                                          type="submit"
                                          onClick={() =>
                                          {  DeleteAppointment(slot.id); console.log(slot.id)}
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="font-medium text-center"
                        >
                          No data Available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex  justify-end">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="w-16  font-semibold text-xs h-8 rounded-sm"
                    variant="ghost"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    className="w-16 text-xs  font-semibold h-8 rounded-sm"
                    variant="ghost"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster position="top-right" theme="system" richColors/>
    </div>
  );
};

export const AppointmentPage = () => {
  return <PageBuilder mainContent={<AppointmentContent />} />;
};
