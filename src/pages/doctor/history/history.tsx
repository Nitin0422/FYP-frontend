import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import {
  GET_BOOKED_SLOTS_BY_DOCTOR,
  GET_DOCTOR_ID,
  GET_DOCTOR_NAME,
} from "@/constants/API";
import { Appointment } from "@/model/appointment";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { ScheduleContent } from "../schedule/schedule";

const DoctorHistoryContent = () => {
  const [bookedAppts, setBookedAppts] = useState<Appointment[]>([]);
  const [record, setRecord] = useState<Appointment | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [docID, setDocID] = useState(0);
  const [docName, setDocName] = useState("");
  const [requestFromHistory, setRequestFromHistory] = useState(false);

  useEffect(() => {
    client
      .get(GET_DOCTOR_ID)
      .then(function (res) {
        setDocID(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
    client
      .get(GET_DOCTOR_NAME)
      .then(function (res) {
        setDocName(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const booked_url = GET_BOOKED_SLOTS_BY_DOCTOR + docID;
    client
      .get(booked_url)
      .then(function (res) {
        setBookedAppts(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [docID, docName]);

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
      accessorKey: "patient_full_name",
      header: ({ column }) => {
        return (
          <Button
            className="w-full"
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
      id: "Actions",
      header: () => <div className="text-center"> Actions </div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              className="w-24 text-xs h-8 rounded-sm"
              onClick={() => {
                console.log(row.original);
                setRecord(row.original);
                setRequestFromHistory(true);
                setShowRecord(true);
              }}
            >View Records</Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="p-4">
      <span className="text-lg font-bold">Appointment History</span>
      {showRecord ? (
        <ScheduleContent slotInfo={record} isSelected={true} requestFromHistory={requestFromHistory} setShowRecord={() => setShowRecord(false)}/>
      ) : (
        <div className="pt-3">
          <DataTable columns={apptColumn} data={bookedAppts} />
        </div>
      )}
    </div>
  );
};

export const DoctorHistoryPage = () => {
  return <PageBuilder mainContent={<DoctorHistoryContent />} />;
};
