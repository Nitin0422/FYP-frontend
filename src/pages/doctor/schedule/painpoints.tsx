import client from "@/axios-config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GET_ADD_DELETE_PAINPOINTS,
  GET_PAINPOINTS_BY_APPOINTMENT,
} from "@/constants/API";
import { Plus, Dot, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { Appointment } from "../appointment/appointment";
import { toast } from "sonner";
import useAuth from "@/context/AuthContext";

interface PainpointCardProps {
  slotInfo: Appointment | null;
}

export const PainpontCard = ({ slotInfo }: PainpointCardProps) => {
  const { role } = useAuth();
  const [painpointDialog, setPainpointDialog] = useState<boolean>(false);
  const [painpoint, setPainpoint] = useState<string>("");
  const [painpointList, setPainpointList] = useState<Painpoint[]>([]);
  const [fetchData, setFetchData] = useState<boolean>(true);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_PAINPOINTS_BY_APPOINTMENT + slotInfo?.id)
        .then((res) => {
          console.log(res.data);
          setPainpointList(res.data);
          setFetchData(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [fetchData]);

  function SaveAndAddMore() {
    client
      .post(GET_ADD_DELETE_PAINPOINTS, {
        appointment: slotInfo?.id,
        painpoint: painpoint,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Painpoint added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setPainpoint("");
  }

  function SaveAndClose() {
    client
      .post(GET_ADD_DELETE_PAINPOINTS, {
        appointment: slotInfo?.id,
        painpoint: painpoint,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Painpoint added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setPainpoint("");
    setPainpointDialog(false);
  }

  function DeletePainpoint(id: number) {
    client
      .delete(GET_ADD_DELETE_PAINPOINTS + id)
      .then(() => {
        setFetchData(true);
        toast.error("Painpoint deleted successfully");
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
      <div className="flex justify-between items-center  m-0">
        <span className="text-md font-bold"> Painpoints </span>
        {role === "doctor" &&  isToday(
                    slotInfo?.date ? new Date(slotInfo.date) : undefined
                  ) && (
          <Dialog
            open={painpointDialog}
            onOpenChange={() => setPainpointDialog(!painpointDialog)}
          >
            <DialogTrigger>
              <Plus
                size={25}
                className="border border-green-500 rounded-full p-1"
              />
            </DialogTrigger>
            <DialogContent>
              <span className="text-md font-semibold"> Add painpoint </span>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="painpoint">Painpoint </Label>
                <Input
                  id="painpoint"
                  placeholder="Patient Complaints"
                  value={painpoint}
                  onChange={(e) => setPainpoint(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  className="text-sm  h-9"
                  onClick={() => SaveAndAddMore()}
                >
                  {" "}
                  Save & Add More{" "}
                </Button>
                <Button className="text-sm  h-9" onClick={() => SaveAndClose()}>
                  {" "}
                  Save & Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <hr className="m-0"></hr>
      <div className="text-sm pr-1">
        <div className=" flex flex-col gap-1">
          {painpointList.map((painpoint, index) => (
            <div className="flex justify-between items-center" key={index}>
              <p className="flex gap items-center">
                {" "}
                <Dot /> {painpoint.painpoint}{" "}
              </p>
              {role === "doctor" && isToday(
                    slotInfo?.date ? new Date(slotInfo.date) : undefined
                  ) &&  (
                <Minus
                  size={20}
                  className="border border-red-500 rounded-full p-1"
                  onClick={() => DeletePainpoint(painpoint.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
