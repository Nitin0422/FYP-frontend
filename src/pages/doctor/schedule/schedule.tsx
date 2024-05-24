import { PageBuilder } from "@/components/PageBuilder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { GeneralCard } from "./gencard";
import { PainpontCard } from "./painpoints";
import { SuggestionCard } from "./suggestions";
import { PrescriptionCard } from "./prescriptions";
import { TestCard } from "./tests";
import { Appointment } from "../appointment/appointment";
import client from "@/axios-config";
import {
  GET_ADD_HEALTH_SNAPSHOTS,
  GET_HEALTH_SNAPSHOTS_BY_APPOINTMENT,
  GET_PATIENT_BY_ID,
  GET_TODAYS_APPOINTMENTS,
} from "@/constants/API";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { PatientData } from "@/pages/admin/users/patients/patients";
import { Toaster, toast } from "sonner";

interface ScheduleContentProps {
  slotInfo: Appointment | null;
  isSelected: boolean;
  requestFromHistory?: boolean;
  setShowRecord?: () => void;
}

export const ScheduleContent = ({
  slotInfo,
  isSelected,
  requestFromHistory,
  setShowRecord,
}: ScheduleContentProps) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(isSelected);
  const [slotinfo, setSlotInfo] = useState<Appointment | null>(slotInfo);
  const [healthSnapshot, setHealthSnapshot] = useState<HealthSnapshot | null>(
    null
  );
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [snapshotDialog, setSnapshotDialog] = useState(false);

  // for form
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [pulse, setPulse] = useState("");

  useEffect(() => {
    client.get(GET_TODAYS_APPOINTMENTS).then((res) => {
      setTodayAppointments(res.data);
    });
  }, []);

  //find if general details exist for the appointment
  useEffect(() => {
    client
      .get(GET_PATIENT_BY_ID + slotinfo?.patient)
      .then((res) => {
        setPatient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Slot Info:", slotinfo);
    client
      .get(GET_HEALTH_SNAPSHOTS_BY_APPOINTMENT + slotinfo?.id)
      .then((res) => {
        console.log(res.data);
        setWeight(res.data.weight);
        setBloodPressure(res.data.blood_pressure);
        setBloodSugar(res.data.blood_sugar);
        setTemperature(res.data.temperature);
        setOxygen(res.data.oxygen);
        setPulse(res.data.pulse);
        setHealthSnapshot(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [slotinfo, snapshotDialog]);

  function ClearForm() {
    setWeight("");
    setBloodPressure("");
    setBloodSugar("");
    setTemperature("");
    setOxygen("");
    setPulse("");
  }

  function AddHealthSnapShot() {
    if (healthSnapshot) {
      client
        .put(GET_ADD_HEALTH_SNAPSHOTS + healthSnapshot.id, {
          appointment: slotinfo?.id,
          weight: weight,
          blood_pressure: bloodPressure,
          blood_sugar: bloodSugar,
          temperature: temperature,
          oxygen: oxygen,
          pulse: pulse,
        })
        .then((res) => {
          toast.success("Health Snapshot Updated");
          setSelected(true);
          setSnapshotDialog(false);
          setHealthSnapshot(res.data);
        })
        .catch((err) => {
          console.log(err);
          ClearForm();
        });
      setSelected(true);
      return;
    }
    client
      .post(GET_ADD_HEALTH_SNAPSHOTS, {
        appointment: slotinfo?.id,
        weight: weight,
        blood_pressure: bloodPressure,
        blood_sugar: bloodSugar,
        temperature: temperature,
        oxygen: oxygen,
        pulse: pulse,
      })
      .then((res) => {
        console.log(res.data);
        setSelected(true);
        setSnapshotDialog(false);
        setHealthSnapshot(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error("Error adding health snapshot");
        ClearForm();
      });
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {!requestFromHistory && (
        <div>
          <span className="text-lg font-bold"> Today's Schedule</span>
        </div>
      )}

      {!!!selected ? (
        <div className="cards py-2 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-64 lg:gap-5 ">
          {todayAppointments.map((appointment, index) => (
            <div
              key={index}
              className={`flex justify-center items-center  rounded-md
                    ${
                      theme === "dark"
                        ? "bg-[url('@/assets/images/app-dark.jpg')] bg-cover"
                        : "bg-[url('@/assets/images/app-light.jpg')] bg-cover"
                    }
                  `}
            >
              <Card
                className={`w-5/6 h-60 flex items-center pl-14 
                    ${
                      theme === "dark"
                        ? "bg-gray-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 w-full "
                        : " bg-green-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 w-full"
                    }
                     lg:w-full lg:grid-cols-5`}
              >
                <CardHeader className="p-0  rounded-md lg:col-span-2"></CardHeader>
                <CardContent className="col-span-3  w-full h-full flex flex-col justify-center tracking-wider">
                  <h1 className="text-xl font-semibold">
                    {appointment.patient_full_name}
                    <div className="absolute rounded-sm bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-green-400 to-teal-400"></div>
                  </h1>
                  <h1 className="text-lg font-medium text-muted-foreground">
                    {appointment.date}
                  </h1>
                  <h1 className="text-md font-medium">{appointment.time}</h1>
                  <CardDescription className="">
                    {appointment?.notes || "No notes"}
                  </CardDescription>
                  <Dialog
                    open={snapshotDialog}
                    onOpenChange={() => {
                      setSnapshotDialog(!snapshotDialog);
                    }}
                  >
                    <DialogTrigger
                      className=" flex"
                      onClick={() => {
                        setSlotInfo(appointment);
                      }}
                    >
                      <Button className="w-2/4 mt-3 hover:scale-105 transition-transform">
                        Add Records
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full">
                      <span className="text-md font-semibold">
                        {" "}
                        General Health Details
                      </span>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="weight">
                            Weight{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in kg){" "}
                            </span>
                          </Label>
                          <Input
                            id="weight"
                            placeholder="56 kg"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="blood_pressure">
                            Blood Pressure{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in mm of Hg){" "}
                            </span>
                          </Label>
                          <Input
                            id="blood_pressure"
                            placeholder="120/90"
                            value={bloodPressure}
                            onChange={(e) => setBloodPressure(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="blood_sugar">
                            Blood Sugar{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in mmol/L ){" "}
                            </span>
                          </Label>
                          <Input
                            id="blood_sugar"
                            placeholder="105"
                            value={bloodSugar}
                            onChange={(e) => setBloodSugar(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="temperature">
                            Temperature{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in °F){" "}
                            </span>
                          </Label>
                          <Input
                            id="temperature"
                            placeholder="98.4"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="oxygen">
                            SpO2{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in %){" "}
                            </span>
                          </Label>
                          <Input
                            id="oxygen"
                            placeholder="98.4"
                            value={oxygen}
                            onChange={(e) => setOxygen(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex flex-col items-start space-y-2">
                          <Label htmlFor="pulse">
                            Pulse{" "}
                            <span className="text-muted-foreground">
                              {" "}
                              (in bpm){" "}
                            </span>
                          </Label>
                          <Input
                            id="pulse"
                            placeholder="72"
                            value={pulse}
                            onChange={(e) => setPulse(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            className="px-2 w-24 text-sm font-medium"
                            onClick={() => AddHealthSnapShot()}
                          >
                            {" "}
                            Procced <ArrowRight size={15} />{" "}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* top card component  */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
            <div className="col-span-2">
              <GeneralCard
                setSelected={setSelected}
                slotInfo={slotinfo}
                healthSnapshot={healthSnapshot}
                patient={patient}
                setSnapshotDialog={setSnapshotDialog}
                setHealthSnapShot={setHealthSnapshot}
                requestFromHistory={requestFromHistory || false}
                setShowRecord={setShowRecord}
              />
            </div>
            <div className="col-span-1">
              <TestCard appointment={slotinfo} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <PainpontCard slotInfo={slotinfo} />
            <SuggestionCard slotInfo={slotinfo} />
          </div>

          <PrescriptionCard appointment={slotinfo} />
        </div>
      )}
      <Toaster
        position="top-right"
        closeButton={true}
        theme={theme}
        richColors
      />
    </div>
  );
};

export const SchedulePage = () => {
  return (
    <PageBuilder
      mainContent={<ScheduleContent slotInfo={null} isSelected={false} />}
    />
  );
};
