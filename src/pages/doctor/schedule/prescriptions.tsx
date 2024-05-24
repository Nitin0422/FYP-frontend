import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, FileEdit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Appointment } from "../appointment/appointment";
import client from "@/axios-config";
import {
  GET_ADD_DELETE_PRESCRIPTIONS,
  GET_PRESCRIPTIONS_BY_APPOINTMENT,
} from "@/constants/API";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuth from "@/context/AuthContext";

interface PrescriptionCardProps {
  appointment: Appointment | null;
}

export const PrescriptionCard = ({ appointment }: PrescriptionCardProps) => {
  const { role } = useAuth();
  const [prescriptionDialog, setPrescriptionDialog] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<boolean>(true);
  const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);
  const [updateRequest, setUpdateRequest] = useState<boolean>(false);

  //FORMS
  const [prescriptionID, setPrescriptionID] = useState<number>(0);
  const [medicationName, setMedicationName] = useState<string>("");
  const [medicationDose, setMedicationDose] = useState<string>("");
  const [dosageFrequency, setDosageFrequency] = useState<number>(0);
  const [timing, setTiming] = useState<string>("");
  const [medicationNotes, setMedicationNotes] = useState<string>("");

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_PRESCRIPTIONS_BY_APPOINTMENT + appointment?.id)
        .then((res) => {
          console.log(res.data);
          setPrescriptionList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setFetchData(false);
    }
  }, [fetchData]);

  // useEffect(() => {
  //   ClearForm();
  // }, [prescriptionDialog]);

  function ClearForm() {
    setMedicationName("");
    setMedicationDose("");
    setDosageFrequency(0);
    setTiming("");
    setMedicationNotes("");
  }

  function SaveAndAddMore() {
    client
      .post(GET_ADD_DELETE_PRESCRIPTIONS, {
        appointment: appointment?.id,
        medication_name: medicationName,
        medication_dosage: medicationDose,
        dosage_frequency: dosageFrequency,
        timing: timing,
        medication_notes: medicationNotes,
      })
      .then(() => {
        toast.success("Prescription added");
        setFetchData(true);
      })
      .catch((err) => {
        console.log(err);
      });
    ClearForm();
  }

  function SaveAndClose() {
    client
      .post(GET_ADD_DELETE_PRESCRIPTIONS, {
        appointment: appointment?.id,
        medication_name: medicationName,
        medication_dosage: medicationDose,
        dosage_frequency: dosageFrequency,
        timing: timing,
        medication_notes: medicationNotes,
      })
      .then(() => {
        toast.success("Prescription added");
        setFetchData(true);
      })
      .catch((err) => {
        console.log(err);
      });
    ClearForm();
    setPrescriptionDialog(false);
  }
  function DeletePrescription(id: number) {
    client
      .delete(GET_ADD_DELETE_PRESCRIPTIONS + id)
      .then(() => {
        toast.error("Prescription deleted");
        setFetchData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function UpdatePrescriptionHandler(id: number) {
    client
      .get(GET_ADD_DELETE_PRESCRIPTIONS + id)
      .then((res) => {
        console.log(res.data);
        setPrescriptionID(res.data.id);
        setMedicationName(res.data.medication_name);
        setMedicationDose(res.data.medication_dosage);
        setDosageFrequency(res.data.dosage_frequency);
        setTiming(res.data.timing);
        setMedicationNotes(res.data.medication_notes);
        setPrescriptionDialog(true);
        setUpdateRequest(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function UpdatePrescription() {
    client
      .put(GET_ADD_DELETE_PRESCRIPTIONS + prescriptionID, {
        appointment: appointment?.id,
        medication_name: medicationName,
        medication_dosage: medicationDose,
        dosage_frequency: dosageFrequency,
        timing: timing,
        medication_notes: medicationNotes,
      })
      .then(() => {
        toast.success("Prescription updated");
        setFetchData(true);
        setPrescriptionDialog(false);
        setUpdateRequest(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
    <Card className="px-3 py-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-md font-bold"> Prescriptions </span>
        {role === "doctor" && isToday(
            appointment?.date ? new Date(appointment.date) : undefined
          ) &&  (
          <Dialog
            open={prescriptionDialog}
            onOpenChange={() => setPrescriptionDialog(!prescriptionDialog)}
          >
            <DialogTrigger>
              <Plus
                size={25}
                className="border border-green-500 rounded-full p-1"
              />
            </DialogTrigger>
            <DialogContent>
              <span className="text-lg font-medium "> Add Prescription </span>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="prescriptionName" className="text-sm">
                  Medication Name{" "}
                </Label>
                <Input
                  id="prescriptionName"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Paracetamol"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="prescriptionDose" className="text-sm">
                  Medication Dose{" "}
                </Label>
                <Input
                  id="prescriptionDose"
                  placeholder="500mg"
                  value={medicationDose}
                  onChange={(e) => setMedicationDose(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="reps" className="text-sm">
                  Dosage Frequency
                </Label>
                <Input
                  id="reps"
                  placeholder="3"
                  value={dosageFrequency}
                  onChange={(e) => setDosageFrequency(Number(e.target.value))}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="timing" className="text-sm">
                  Timing
                </Label>
                <Select value={timing} onValueChange={setTiming}>
                  <SelectTrigger className="w-full text-sm flex justify-between items-center rounded-lg border p-2">
                    {timing || "Select timing"}
                  </SelectTrigger>
                  <SelectContent className=" w-[310px] h-[150px] overflow-y-scroll p-3 rounded-lg bg-gray-400 backdrop-filter backdrop-blur-sm bg-opacity-10 sm:w-[400px] md:w-[530px]">
                    <SelectItem
                      value="After Lunch"
                      className="py-2 cursor-pointer text-sm"
                    >
                      After Lunch
                    </SelectItem>
                    <SelectItem
                      value="Before Lunch"
                      className="py-2 cursor-pointer text-sm"
                    >
                      Before Lunch
                    </SelectItem>
                    <SelectItem
                      value="Empty Stomach"
                      className="py-2 cursor-pointer text-sm"
                    >
                      Empty Stomach
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="notes" className="text-sm">
                  Medication Notes
                </Label>
                <Input
                  id="notes"
                  placeholder="3"
                  value={medicationNotes}
                  onChange={(e) => setMedicationNotes(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                {updateRequest ? (
                  <Button
                    className="text-sm  h-9"
                    onClick={() => UpdatePrescription()}
                  >
                    {" "}
                    Update{" "}
                  </Button>
                ) : (
                  <>
                    <Button
                      className="text-sm  h-9"
                      onClick={() => SaveAndAddMore()}
                    >
                      {" "}
                      Save & Add More{" "}
                    </Button>
                    <Button
                      className="text-sm  h-9"
                      onClick={() => {
                        SaveAndClose();
                      }}
                    >
                      {" "}
                      Save & Close
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <hr></hr>

      <div className="text-sm">
        <Table className="border rounded-3xl">
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead> Medication Name </TableHead>
              <TableHead> Medication Dose </TableHead>
              <TableHead> Dosage Frequency </TableHead>
              <TableHead> Timing </TableHead>
              <TableHead> Notes </TableHead>
              {role === "doctor" && isToday(
            appointment?.date ? new Date(appointment.date) : undefined
          ) &&  <TableHead> Action </TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {prescriptionList.length !== 0 ? (
              <>
                {prescriptionList.map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>{prescription.medication_name}</TableCell>
                    <TableCell>{prescription.medication_dosage}</TableCell>
                    <TableCell> {prescription.dosage_frequency} </TableCell>
                    <TableCell>{prescription.timing}</TableCell>
                    <TableCell>{prescription.medication_notes}</TableCell>
                    {role === "doctor" && isToday(
            appointment?.date ? new Date(appointment.date) : undefined
          ) && (
                      <TableCell>
                        <div className="flex gap-3">
                          <FileEdit
                            size={26}
                            className="border border-yellow-500 rounded-full p-1"
                            onClick={() =>
                              UpdatePrescriptionHandler(prescription.id)
                            }
                          />
                          <Dialog>
                            <DialogTrigger>
                              <X
                                size={26}
                                className="border border-red-500 rounded-full p-1"
                              />
                            </DialogTrigger>
                            <DialogContent>
                              <span className="text-lg font-medium">
                                {" "}
                                Delete this prescription?{" "}
                              </span>
                              <div className="flex justify-end">
                                <Button
                                  variant="destructive"
                                  className="text-sm h-9 rounded-md px-4"
                                  onClick={() => {
                                    DeletePrescription(prescription.id);
                                  }}
                                >
                                  {" "}
                                  Delete{" "}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="font-medium text-center">
                  No medications prescribed.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
