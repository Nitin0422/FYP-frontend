import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Dot, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { Appointment } from "../appointment/appointment";
import client from "@/axios-config";
import {
  GET_ADD_DELETE_SUGGESTIONS,
  GET_SUGGESTIONS_BY_APPOINTMENT,
} from "@/constants/API";
import { toast } from "sonner";
import useAuth from "@/context/AuthContext";

interface SuggestionsCardProps {
  slotInfo: Appointment | null;
}

export const SuggestionCard = ({ slotInfo }: SuggestionsCardProps) => {
  const [suggestionDialog, setSuggestionDialog] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [suggestionList, setSuggestionList] = useState<Suggestions[]>([]);
  const [fetchData, setFetchData] = useState<boolean>(true);
  const { role } = useAuth();

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_SUGGESTIONS_BY_APPOINTMENT + slotInfo?.id)
        .then((res) => {
          console.log(res.data);
          setSuggestionList(res.data);
          setFetchData(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [fetchData]);

  function SaveAndAddMore() {
    client
      .post(GET_ADD_DELETE_SUGGESTIONS, {
        appointment: slotInfo?.id,
        suggestion: suggestion,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Painpoint added successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error adding suggestion");
      });
    setSuggestion("");
  }

  function SaveAndClose() {
    client
      .post(GET_ADD_DELETE_SUGGESTIONS, {
        appointment: slotInfo?.id,
        suggestion: suggestion,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Painpoint added successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error adding suggestion");
      });
    setSuggestion("");
    setSuggestionDialog(false);
  }

  function DeleteSuggestion(id: number) {
    client
      .delete(GET_ADD_DELETE_SUGGESTIONS + id)
      .then(() => {
        setFetchData(true);
        toast.error("Suggestion deleted");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error deleting suggestion");
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
        <span className="text-md font-bold"> Doctor Suggestions </span>
        {role === "doctor" && isToday(
            slotInfo?.date ? new Date(slotInfo.date) : undefined
          ) &&  (
            <Dialog
            open={suggestionDialog}
            onOpenChange={() => setSuggestionDialog(!suggestionDialog)}
          >
            <DialogTrigger>
              <Plus
                size={25}
                className="border border-green-500 rounded-full p-1"
              />
            </DialogTrigger>
            <DialogContent>
              <span className="text-md font-semibold"> Add Suggestion </span>
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="suggestion">Suggestion </Label>
                <Input
                  id="suggestion"
                  placeholder="Your Suggestions"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button className="text-sm  h-9" onClick={() => SaveAndAddMore()}>
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
      <hr></hr>
      <div className="text-sm pr-1">
        <div className="flex flex-col gap-1">
          {suggestionList.map((suggestion, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="flex gap items-center">
                {" "}
                <Dot /> {suggestion.suggestion}{" "}
              </p>
              {role === "doctor" && isToday(
            slotInfo?.date ? new Date(slotInfo.date) : undefined
          ) && (
                <Minus
                size={20}
                className="border border-red-500 rounded-full p-1"
                onClick={() => DeleteSuggestion(suggestion.id)}
              />
              )}
              
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
