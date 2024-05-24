import client from "@/axios-config";
import { Card, CardContent } from "@/components/ui/card";
import { GET_DOCTOR_NAME, GET_PREV_APPOINTMENT } from "@/constants/API";
import useAuth from "@/context/AuthContext";
import { Appointment } from "@/model/appointment";
import { SlotInfo } from "@/pages/admin/appointment/appointment";
import { PatientData } from "@/pages/admin/users/patients/patients";
import { ArrowLeftCircle, ClipboardPen, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { ScheduleContent } from "./schedule";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface GeneralCardProps {
  setSelected: (selected: boolean) => void;
  slotInfo: SlotInfo | null;
  healthSnapshot: HealthSnapshot | null;
  setHealthSnapShot: (healthSnapshot: null | HealthSnapshot) => void;
  patient: PatientData | null;
  setSnapshotDialog: (snapshotDialog: boolean) => void;
  requestFromHistory: boolean;
  setShowRecord?: () => void;
}

export const GeneralCard = ({
  setSelected,
  slotInfo,
  healthSnapshot,
  patient,
  setSnapshotDialog,
  setHealthSnapShot,
  requestFromHistory,
  setShowRecord,
}: GeneralCardProps) => {
  const { role } = useAuth();
  const [docName, setDocName] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const [prevAppointment, setPrevAppointment] = useState<Appointment | null>(
    null
  );

  function GetPrevAppointment(id: number | undefined) {
    if (!id) return;
    const url = GET_PREV_APPOINTMENT + id;
    client
      .get(url)
      .then((res) => {
        setPrevAppointment(res.data);
        setSheetOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // useEffect(() => {
  //   setSheetOpen(true)
  // }, [prevAppointment])

  useEffect(() => {
    client
      .get(GET_DOCTOR_NAME)
      .then((res) => {
        setDocName(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const isToday = (someDate: Date | undefined) => {
    if (!someDate) return false;
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="">
      <CardContent className="py-2 flex flex-col gap-2">
        <div className="flex flex-col items-center lg:items-center lg:flex-row gap-4 lg:gap-24 ">
          <div className="flex items-center gap-5">
            {requestFromHistory ? (
              <ArrowLeftCircle
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  setShowRecord && setShowRecord();
                }}
              />
            ) : (
              <ArrowLeftCircle
                className="cursor-pointer"
                size={20}
                onClick={() => {
                  setSelected(false);
                  setHealthSnapShot(null);
                }}
              />
            )}{" "}
            <span className="text-md font-semibold text-muted-foreground">
              Appointment ID: {slotInfo?.id}{" "}
            </span>
          </div>
          <span className="text-md font-semibold text-muted-foreground">
            Date: {slotInfo?.date}{" "}
          </span>
          <span className="text-md font-semibold text-muted-foreground">
            Time: {slotInfo?.time}{" "}
          </span>
        </div>
        <hr className="mt-2"></hr>
        <div className="grid grid-cols-12 ">
          <div className="h-full grid grid-cols-2 col-span-11 mb-3 p-2 text-sm gap-12">
            <div className="flex flex-col gap-3 ">
              <span>
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Patient ID :{" "}
                </span>{" "}
                {patient?.id}{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Patient :{" "}
                </span>{" "}
                {patient?.full_name}{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Age :{" "}
                </span>{" "}
                {patient?.age}{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Gender :{" "}
                </span>{" "}
                {patient?.gender}{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Phone Number :{" "}
                </span>{" "}
                {patient?.phone_number}{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Doctor :{" "}
                </span>{" "}
                {docName}{" "}
              </span>
              <span className="flex gap-2">
                <span className="font-semibold text-muted-foreground">
                  Previous Appointment:{" "}
                </span>
                {(slotInfo?.previous_appointment !== null) ? (
                  <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)}>
                    
                       <span className="text-primary underline font-semibold flex gap-2 items-center" onClick={() =>
                        GetPrevAppointment(slotInfo?.previous_appointment)}>
                        {slotInfo?.previous_appointment}{" "}
                        <ExternalLink size={13} />
                      </span>
                    
                    {/* <span className="text-primary underline font-semibold flex gap-2 items-center" onClick={() =>
                      GetPrevAppointment(slotInfo?.previous_appointment)}>
                      {slotInfo?.previous_appointment}{" "}
                      <ExternalLink size={13} />
                    </span> */}
                    <SheetContent className="min-w-full">
                      <ScheduleContent slotInfo={prevAppointment} isSelected={true} requestFromHistory={true} />
                    </SheetContent>
                  </Sheet>
                  ) : (
                    <span className="text-[11px] font-thin text-muted-foreground text">
                      ----
                      </span>
                  )}
              </span>
            </div>
            <div className="flex flex-col gap-3 ">
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Chronic Disease :{" "}
                </span>{" "}
                {patient?.chronic_disease}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Weight :{" "}
                </span>{" "}
                {healthSnapshot?.weight} kg
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Blood Pressure :{" "}
                </span>{" "}
                {healthSnapshot?.blood_pressure} mm of Hg
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Blood Sugar :{" "}
                </span>{" "}
                {healthSnapshot?.blood_sugar} mmol/L
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Temperature :
                </span>{" "}
                {healthSnapshot?.temperature} °F{" "}
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Oxygen :{" "}
                </span>{" "}
                {healthSnapshot?.oxygen} %
              </span>
              <span>
                {" "}
                <span className="font-semibold text-muted-foreground">
                  {" "}
                  Pulse :{" "}
                </span>{" "}
                {healthSnapshot?.pulse} bpm
              </span>
            </div>
          </div>
          {role === "doctor" &&
            isToday(slotInfo?.date ? new Date(slotInfo.date) : undefined) && (
              <div className="flex justify-end m-0">
                <ClipboardPen
                  size={25}
                  className="border border-yellow-500 rounded-full p-1"
                  onClick={() => {
                    setSnapshotDialog(true);
                    setSelected(false);
                  }}
                />
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
