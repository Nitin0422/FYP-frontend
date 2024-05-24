import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar1";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import client from "@/axios-config";
import {
  GET_APPTS_BY_DOC,
  GET_DOCTOR_ID,
  GET_DOCTOR_NAME,
  GET_OR_ADD_SLOT,
  GET_TODAYS_APPOINTMENTS,
  UPD_DEL_GET_SLOT,
} from "@/constants/API";
import { Toaster, toast } from "sonner";

export type Appointment = {
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

export type Slot = {
  id: number;
  date: Date;
  doctor_id: number;
  doctor_full_name: string;
  slots_available: number;
  time: string;
};
const DoctorAppointmentContent = () => {
  const [openSlots, setOpenSlots] = useState<Slot[]>([]);
  const [bookedAppts, setBookedAppts] = useState<Appointment[]>([]);

  const [fetchData, setFetchData] = useState(true);
  const [ID, setID] = useState(0);

  const [date, setDate] = useState<Date>(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [slots, setSlots] = useState(5);
  const [docID, setDocID] = useState(0);
  const [docName, setDocName] = useState("");

  const [updateRequest, setUpdateRequest] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [delDialogOpen, setDelDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(0);

  useEffect(() => {
    client
      .get(GET_DOCTOR_ID)
      .then(function (res) {
        setDocID(res.data);
        setFetchData(true);
      })
      .catch(function (err) {
        console.log(err);
      });
    client
      .get(GET_DOCTOR_NAME)
      .then(function (res) {
        setDocName(res.data);
        console.log(docID, docName);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_APPTS_BY_DOC + docID)
        .then(function (res) {
          console.log(res.data);
          setOpenSlots(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
      const booked_url = GET_TODAYS_APPOINTMENTS;
      client
        .get(booked_url)
        .then(function (res) {
          setBookedAppts(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
      setFetchData(false);
    }
  }, [docID, fetchData]);

  useEffect(() => {
    if (fetchData) {
      const booked_url = GET_TODAYS_APPOINTMENTS;
      client
        .get(booked_url)
        .then(function (res) {
          setBookedAppts(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
      setFetchData(false);
    }
  }, [docID, fetchData]);

  function ClearForm() {
    setDate(new Date());
    setSlots(5);
    setTimeSlot("");
  }
  function CloseDialog() {
    setUpdateRequest(false);
    setDialogOpen(!dialogOpen);
    ClearForm();
  }
  function AddSlot() {
    var year = date.getFullYear();
    // Adding 1 to month because getMonth() returns zero-based month index
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");

    // Format the date as YYYY-MM-DD
    var formattedDate = `${year}-${month}-${day}`;
    client
      .post(GET_OR_ADD_SLOT, {
        date: formattedDate,
        doctor_id: docName,
        time: timeSlot,
        slots_available: slots,
      })
      .then(function (res) {
        setFetchData(true);
        console.log(res);
        CloseDialog();
        ClearForm();
      })
      .catch(function (err) {
        console.log(err);
        alert(
          "Slot with same date & time cannot be defined for the same doctor"
        );
        ClearForm();
      });
  }

  function EditHandler(id: number) {
    setDialogOpen(true);
    setUpdateRequest(true);
    console.log(id);
    client
      .get(UPD_DEL_GET_SLOT + id)
      .then(function (res) {
        setID(id);
        setDate(new Date(res.data.date));
        setTimeSlot(res.data.time);
        setSlots(res.data.slots_available);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  function EditAppointmentSlot() {
    var year = date.getFullYear();
    // Adding 1 to month because getMonth() returns zero-based month index
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");

    // Format the date as YYYY-MM-DD
    var formattedDate = `${year}-${month}-${day}`;
    client
      .put(UPD_DEL_GET_SLOT + ID + "/", {
        date: formattedDate,
        doctor_id: docID,
        time: timeSlot,
        slots_available: slots,
      })
      .then(function (res) {
        setFetchData(true);
        console.log(res);
        CloseDialog();
        ClearForm();
      })
      .catch(function (err) {
        console.log(err);
        alert(
          "Slot with same date & time cannot be defined for the same doctor"
        );
        ClearForm();
      });
  }
  function DeleteAppointment() {
    client
      .delete(UPD_DEL_GET_SLOT + slotToDelete + "/")
      .then(function (res) {
        setFetchData(true);
        setDelDialogOpen(false);
        setSlotToDelete(0);
      })
      .catch(function (err) {
        setDelDialogOpen(false);
        setSlotToDelete(0);
        toast.error("Cannot delete!! This slot has appointments booked");
      });
  }

  type SelectSingleEventHandler = (day: Date | undefined) => void;
  const handleSelect: SelectSingleEventHandler = (selectedDay) => {
    if (selectedDay) {
      // Ensure selectedDay is not undefined
      setDate(selectedDay);
    }
  };
  const apptColumn: ColumnDef<Appointment>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "doctor_full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Doctor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "patient_full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Patient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Appointment Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "time",
      header: "Appointment Time",
    },
    {
      accessorKey: "slots_available",
      header: ({ column }) => {
        return (
          <Button
            className="text-left"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slots Available
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex gap-4 flex-col p-4">
      <div className="w-full flex justify-between items-center">
        <span className="text-xl font-bold">Your Appointments </span>
        <Dialog open={dialogOpen} onOpenChange={() => CloseDialog()}>
          <DialogTrigger className="text-xs h-8 md:text-sm md:h-full border rounded-md p-2 border-gray-500">
            {" "}
            + Add Appointment Slot{" "}
          </DialogTrigger>
          <DialogContent>
            <span className="text-md font-medium">
              {" "}
              {updateRequest ? `Update` : `Add`} Appointment Slot
            </span>
            <div className="container w-full p-0 flex flex-col gap-3">
              <div className="w-full flex flex-col gap-2">
                <Label>
                  {" "}
                  Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />{" "}
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      className=" z-10 bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-20"
                      mode="single"
                      selected={date}
                      onSelect={handleSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full">
                <Label htmlFor="time" className="">
                  Time <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-500 italic">
                  {" "}
                  *Only select hour in this field
                </span>
                <Input
                  aria-label="Choose time"
                  className="w-full"
                  id="time"
                  type="time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  min="09:00"
                  max="18:00"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="numberOfSlots">
                  Number of Slot <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={slots}
                  onChange={(e) => setSlots(parseInt(e.target.value))}
                  className="w-full"
                  id="time"
                  type="number"
                />
              </div>
              {!!!updateRequest ? (
                <Button className="lg:col-span-1" onClick={() => AddSlot()}>
                  Add Slot
                </Button>
              ) : (
                <Button
                  className="lg:col-span-1"
                  onClick={() => EditAppointmentSlot()}
                >
                  Update Slot
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="">
        <Card className="p-3 max-h-[230px]">
          <CardTitle className="text-lg"> Open Appointment Slots </CardTitle>
          <CardContent className="mt-4 flex gap-4 overflow-y-scroll">
            {openSlots
              ?.filter((slot) => slot.slots_available > 0)
              .map((slot, index) => (
                <Card
                  key={index}
                  className="text-sm min-w-[250px] flex justify-center items-center p-2 shadow-inner border-green-600 hover:border-green-400 hover:shadow-lg"
                >
                  <CardContent className="flex flex-col gap-1 pt-3 w-full justify-center text-center">
                    <span className="font-semibold">{String(slot.date)}</span>
                    <span className="text-xs ">Time: {slot.time}</span>
                    <span className="text-xs ">
                      Slots Available: {slot.slots_available}
                    </span>
                    <span className="text-xs flex gap-2 justify-center mt-2">
                      <Button
                        className="w-16 h-9 bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => EditHandler(slot.id)}
                      >
                        Edit
                      </Button>
                      <Dialog
                        open={delDialogOpen}
                        onOpenChange={() => setDelDialogOpen(!delDialogOpen)}
                      >
                        <DialogTrigger className="w-16 h-9 border bg-red-700 hover:bg-red-600 rounded-lg" onClick={() => setSlotToDelete(slot.id)}>
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
                                Do you want to delete appointment ?
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
                                onClick={() => {console.log(slot); DeleteAppointment()}}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </span>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="">
        <Card className="p-3">
          <CardTitle className="text-lg"> Booked Appointments</CardTitle>
          <CardContent className="w-full mt-3">
            <DataTable columns={apptColumn} data={bookedAppts} />
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" richColors theme="system" />
    </div>
  );
};

export const DoctorAppointmentPage = () => {
  return <PageBuilder mainContent={<DoctorAppointmentContent />} />;
};
