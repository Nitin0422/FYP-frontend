import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar1";
import { Input } from "@/components/ui/input";
import {
  GET_DOCTORS,
  GET_OR_ADD_SLOT,
  UPD_DEL_GET_SLOT,
} from "@/constants/API";
import { cn } from "@/lib/utils";

import { Label } from "@radix-ui/react-label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon, ChevronDown, Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";

type Slot = {
  id: number;
  date: Date;
  doctor_id: number;
  doctor_full_name: string;
  slots_available: number;
  time: string;
};

const AppointmentSlotContent = () => {
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [slotList, setSlotList] = useState<Slot[]>([]);
  const [fetchData, setFetchData] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [updateRequest, setUpdateRequest] = useState(false);

  //form
  const [date, setDate] = useState<Date>(new Date());
  const [doctor, setDoctor] = useState("");
  const [slots, setSlots] = useState(5);
  const [timeSlot, setTimeSlot] = useState("");

  const [ID, setID] = useState(0);

  const [URL, setURL] = useState("");

  const isAddButtonDisabled = !(date && doctor && timeSlot && slots);


  type SelectSingleEventHandler = (day: Date | undefined) => void;


  const handleSelect: SelectSingleEventHandler = (selectedDay) => {
    if (selectedDay) {
      // Ensure selectedDay is not undefined
      setDate(selectedDay);
    }
  };

  useEffect(() => {
    const url = UPD_DEL_GET_SLOT + ID + "/";
    setURL(url);
  }, [ID]);

  useEffect(() => {
    TriggerUpdate();
  }, [URL]);

  useEffect(() => {
    client
      .get(GET_DOCTORS)
      .then(function (res) {
        setDoctorList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_OR_ADD_SLOT)
        .then(function (res) {
          console.log(res);
          setSlotList(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
      setFetchData(false);
    }
  }, [fetchData]);

  function ClearForm() {
    setDate(new Date());
    setDoctor("");
    setSlots(5);
    setTimeSlot("");
  }

  async function TriggerUpdate() {
    setShowForm(true);
    setUpdateRequest(true);
    await client
      .get(URL)
      .then(function (res) {
        console.log(res.data);
        const date = new Date(res.data.date);
        setDate(date);
        setDoctor(res.data.doctor_id);
        setTimeSlot(res.data.time);
        setSlots(res.data.slots_available);
      })
      .catch(function () {
        setShowForm(false);
        setUpdateRequest(false);
      });
  }
  function UpdateSlot() {
    var year = date.getFullYear();
    // Adding 1 to month because getMonth() returns zero-based month index
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    // Format the date as YYYY-MM-DD
    var formattedDate = `${year}-${month}-${day}`;
    console.log(URL);
    console.log("Date: ", formattedDate);
    console.log("Doctor: ", doctor);
    console.log("Time: ", timeSlot);
    console.log("Slot: ", slots);
    client
      .put(URL, {
        date: formattedDate,
        doctor_id: doctor,
        time: timeSlot,
        slots_available: slots,
      })
      .then(function (res) {
        setFetchData(true);
        setUpdateRequest(false);
        setShowForm(false);
        console.log(res);
        ClearForm();
        setID(0);
        toast.success("Slot updated successfully");
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Slot with same date & time cannot be defined for the same doctor")
      });
  }

  function DeleteSlot(id: number) {
      const delete_url = UPD_DEL_GET_SLOT + id
      client.delete(delete_url).then(function(){
        console.log("Deleted!");
        setFetchData(true)
        toast.success("Slot deleted successfully")
      }).catch(function(err){
        console.log(err);
        toast.error("Slot not deleted")
      })
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
        doctor_id: doctor,
        time: timeSlot,
        slots_available: slots,
      })
      .then(function (res) {
        setFetchData(true);
        console.log(res);
        ClearForm();
        setShowForm(false);
        toast.success("Slot added successfully");
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Slot with same date & time cannot be defined for the same doctor");
        ClearForm();
      });
  }

  const slotColumn: ColumnDef<Slot>[] = [
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
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: (cellContext) => {
        const row = cellContext.row.original;
        return (
          <div className="flex flex-row gap-2 pl-3 items-center justify-center z-1">
            <Button
              className="w-16 text-xs h-8 rounded-sm bg-yellow-600 hover:bg-yellow-700"
              onClick={() => {
                setID(row.id);
              }}
            >
              Edit
            </Button>
            <Dialog>
              <DialogTrigger>
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
                      onClick={() => DeleteSlot(row.id)}
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

  return (
    <div className="p-4">
      <span className="flex  gap-2 pl-2 sm:flex sm:gap-3 sm:items-center  sm:font-semibold sm:tracking-tight text-lg font-semibold sm:text-xl">
        {" "}
        Appointment Slot Form{" "}
        <Switch
          checked={showForm}
          onClick={() => {
            setUpdateRequest(false);
            ClearForm();
            setShowForm(!showForm);
          }}
        />
      </span>
      {showForm ? (
        <div>
          <div className="p-3 grid grid-cols-1 lg:grid-cols-12 grid-rows-5 lg:grid-rows-1  lg:flex-row items-end gap-2">
            <div className="grid grid-rows-4 lg:grid-rows-1 grid-cols-1 lg:grid-cols-4 gap-2 w-100  row-span-5 lg:row-span-1 lg:col-span-11">
              <div className="w-full flex flex-col">
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
              {!!!updateRequest ? (
                <div className="w-full">
                  <Label htmlFor="doctor" className="">
                    {" "}
                    Doctor <span className="text-red-500">*</span>
                  </Label>
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger className="w-full flex justify-between items-center rounded-lg border p-2">
                      {doctor || "Select doctor"}{" "}
                      <ChevronDown size={10}></ChevronDown>
                    </SelectTrigger>
                    <SelectContent className=" w-[285px] h-[150px] overflow-y-scroll p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[450px] md:w-[230px]">
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
              ) : (
                <> </>
              )}

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
              
            </div>
            {!!!updateRequest ? (
              <Button
                className="lg:col-span-1"
                onClick={AddSlot}
                disabled={isAddButtonDisabled}
              >
                Add Slot
              </Button>
            ) : (
              <Button
                className="lg:col-span-1"
                onClick={() => UpdateSlot()}
                disabled={isAddButtonDisabled}
              >
                Update Slot
              </Button>
            )}
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <span className="text-md text-red-500 italic font-semibold">
                  Note:
                </span>
                <ul className="pt-3">
                  <li className="text-sm flex">
                    <Dot /> Appointments can be booked upto one hour from the
                    selected time
                  </li>
                  <li className="text-sm flex">
                    <Dot /> Default number of appointments in an hour is set to
                    5
                  </li>
                  <li className="text-sm flex">
                    <Dot /> All fields are compulsary
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <DataTable columns={slotColumn} data={slotList} />
        </div>
      )}
      <Toaster richColors position="top-right" theme="system"/>
    </div>
  );
};

export const AppointmentSlotPage = () => {
  return <PageBuilder mainContent={<AppointmentSlotContent />} />;
};
