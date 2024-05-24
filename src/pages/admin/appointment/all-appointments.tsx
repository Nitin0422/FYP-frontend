import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder"
import { Button } from "@/components/ui/button";
import { GET_BOOKED_SLOTS } from "@/constants/API";
import { Appointment } from "@/model/appointment";
import { DataTable } from "@/pages/doctor/appointment/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export const AllAppointmentsContent = () => {
    const [bookedAppts, setBookedAppts] = useState<Appointment[]>([]);

    useEffect(() => {
        client.get(GET_BOOKED_SLOTS).then((res) => {
            setBookedAppts(res.data);
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    
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
    return(
        <div className="p-4 flex flex-col gap-4">
            <span className="text-lg font-bold">All Appointments</span>
            <DataTable columns={apptColumn} data={bookedAppts} />
        </div>
    )
}

export const AllAppointmentsPage = () => {
    return(
        <PageBuilder mainContent={<AllAppointmentsContent />} />
    )
}