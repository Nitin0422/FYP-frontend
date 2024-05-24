import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { ScheduleContent } from "@/pages/doctor/schedule/schedule";
import { DataTable } from "./datatable";
import { useEffect, useState } from "react";
import client from "@/axios-config";
import {
  GET_BOOKED_SLOTS_BY_PATIENT,
  GET_LOGGEDIN_PATIENT_ID,
  GET_LOGGEDIN_PATIENT_NAME,
  RATE_APPOINTMENT,
} from "@/constants/API";
import { Appointment } from "@/model/appointment";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

const PatientHistoryContent = () => {
  const [bookedAppts, setBookedAppts] = useState<Appointment[]>([]);
  const [record, setRecord] = useState<Appointment | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [docID, setDocID] = useState(0);
  const [docName, setDocName] = useState("");
  const [requestFromHistory, setRequestFromHistory] = useState(false);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [apptToRate, setApptToRate] = useState<Appointment | null>(null);
  const [fetchData, setFetchData] = useState(true);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const submitRating = () => {
    client.put(RATE_APPOINTMENT + apptToRate?.id, {
      "rating": rating,
    }).then(function (res) {
      console.log(res.data);
      setRatingDialog(false);
      setFetchData(true);
      toast.success("Rating submitted successfully");
    }).catch(function (err) {
      console.log(err);
      toast.error("Rating submission failed");
    });
  }

  useEffect(() => {
    client
      .get(GET_LOGGEDIN_PATIENT_ID)
      .then(function (res) {
        setDocID(res.data);
        console.log("Patient ID:", res.data);
        setFetchData(true);
      })
      .catch(function (err) {
        console.log(err);
      });
    client
      .get(GET_LOGGEDIN_PATIENT_NAME)
      .then(function (res) {
        setDocName(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (fetchData) {
      const booked_url = GET_BOOKED_SLOTS_BY_PATIENT + docID;
      client
        .get(booked_url)
        .then(function (res) {
          console.log("Result" ,res)
          setBookedAppts(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    setFetchData(false);
  }, [docID, docName, fetchData]);

  const apptColumn: ColumnDef<Appointment>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
      header: ({ column }) => {
        return (
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Appointment Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "Actions",
      header: () => <div className="text-center"> Actions </div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col lg:flex-row gap-2 justify-center ">
            <div className="flex justify-center">
              <Button
                className="w-24 text-xs h-8 rounded-sm"
                onClick={() => {
                  console.log(row.original);
                  setRecord(row.original);
                  setRequestFromHistory(true);
                  setShowRecord(true);
                }}
              >
                View Records
              </Button>
            </div>
            {(!row.original.rating && new Date(row.original.date) < new Date()) && (<div className="flex justify-center">
                <Dialog
                  open={ratingDialog}
                  onOpenChange={() => {setRatingDialog(!ratingDialog); setRating(0);}}
                >
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      className="w-24 text-xs h-8 rounded-sm"
                      onClick={() => setApptToRate(row.original)}
                    >
                      Rate <Star size={16} className="pl-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex flex-col items-center gap-3">
                      <span className="w-full font-semibold">Rate your experience </span>
                      <div className="flex gap-2">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <span
                            key={ratingValue}
                            onClick={() => handleStarClick(ratingValue)}
                            style={{
                              cursor: "pointer",
                              color: ratingValue <= rating ? "gold" : "gray",
                            }}
                          >
                            <Star size={24} />
                          </span>
                        );
                      })}
                      </div>
                      <p className="text-xs text-muted-foreground text-medium">Selected rating: {rating}</p>
                      <div>
                        <Button
                          className="w-24 text-xs h-8 rounded-sm"
                          onClick={() => {
                            submitRating();
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>)}
            {/* {row.original.rating < 0 ? (
              <>Render this </>
            ) : (
              <div className="flex justify-center">
                <Dialog
                  open={ratingDialog}
                  onOpenChange={() => {setRatingDialog(!ratingDialog); setRating(0);}}
                >
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      className="w-24 text-xs h-8 rounded-sm"
                      onClick={() => setApptToRate(row.original)}
                    >
                      Rate <Star size={16} className="pl-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex flex-col items-center gap-3">
                      <span className="w-full font-semibold">Rate your experience </span>
                      <div className="flex gap-2">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <span
                            key={ratingValue}
                            onClick={() => handleStarClick(ratingValue)}
                            style={{
                              cursor: "pointer",
                              color: ratingValue <= rating ? "gold" : "gray",
                            }}
                          >
                            <Star size={24} />
                          </span>
                        );
                      })}
                      </div>
                      <p className="text-xs text-muted-foreground text-medium">Selected rating: {rating}</p>
                      <div>
                        <Button
                          className="w-24 text-xs h-8 rounded-sm"
                          onClick={() => {
                            submitRating();
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )} */}
          </div>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <span className="text-lg font-bold">Appointment History</span>
      {showRecord ? (
        <ScheduleContent
          slotInfo={record}
          isSelected={true}
          requestFromHistory={requestFromHistory}
          setShowRecord={() => setShowRecord(false)}
        />
      ) : (
        <div className="pt-3">
          <DataTable columns={apptColumn} data={bookedAppts} />
        </div>
      )}
      <Toaster position="top-right" richColors theme="system"/>
    </div>
  );
};

export const PatientHistoryPage = () => {
  return <PageBuilder mainContent={<PatientHistoryContent />} />;
};
