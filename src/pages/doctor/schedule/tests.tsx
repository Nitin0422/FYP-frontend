import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Dot, Minus, FilePlus2, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { Appointment } from "../appointment/appointment";
import client from "@/axios-config";
import { toast } from "sonner";
import {
  GET_ADD_DELETE_TESTS,
  GET_TESTS_BY_APPOINTMENT,
  UPLOAD_IMAGE,
} from "@/constants/API";
import useAuth from "@/context/AuthContext";

interface TestCardProps {
  appointment: Appointment | null;
}

export const TestCard = ({ appointment }: TestCardProps) => {
  const [testDialog, setTestDialog] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<boolean>(true);
  const [testList, setTestList] = useState<MedicalTest[]>([]);
  const { role } = useAuth();

  //form
  const [test, setTest] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (fetchData) {
      client
        .get(GET_TESTS_BY_APPOINTMENT + appointment?.id)
        .then((res) => {
          console.log(res.data);
          setTestList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      //fetch data
      setFetchData(false);
    }
  }, [fetchData]);

  function SaveAndAddMore() {
    client
      .post(GET_ADD_DELETE_TESTS, {
        appointment: appointment?.id,
        name: test,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Test added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setTest("");
  }

  function SaveAndClose() {
    client
      .post(GET_ADD_DELETE_TESTS, {
        appointment: appointment?.id,
        name: test,
      })
      .then(() => {
        setFetchData(true);
        toast.success("Test added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setTest("");
    setTestDialog(false);
  }

  function DeleteTest(id: number) {
    client
      .delete(GET_ADD_DELETE_TESTS + id)
      .then(() => {
        setFetchData(true);
        toast.error("Test deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  }

  function UploadImage(id: number) {
    const url = UPLOAD_IMAGE + id;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      console.log(file);
      console.log(formData);
      client
        .put(
          url,
          { file: file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          setFetchData(true);
          toast.success("Image uploaded successfully");
          setTestDialog(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to upload image");
        });
    }
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

  function openUploadedFile(test: MedicalTest) {
    if (test.file) {
      const djangoBaseUrl = "http://127.0.0.1:8000"; // Your Django server base URL
      const correctImageUrl = djangoBaseUrl + test.file;
      window.open(correctImageUrl, "_blank");
    } else {
      console.error("No file URL found for the test.");
    }
  }

  return (
    <Card className="px-5 py-2 flex flex-col gap-3 min-h-full min-w-full">
      <div className="flex justify-between items-center">
        <span className="text-md font-bold"> Tests</span>
        {role === "doctor" &&
          isToday(
            appointment?.date ? new Date(appointment.date) : undefined
          ) && (
            <Dialog
              open={testDialog}
              onOpenChange={() => setTestDialog(!testDialog)}
            >
              <DialogTrigger>
                <Plus
                  size={28}
                  className="border border-green-500 rounded-full p-1"
                />
              </DialogTrigger>
              <DialogContent>
                <span className="text-md font-semibold"> Add Test </span>
                <div className="flex flex-col items-start space-y-2">
                  <label htmlFor="test">Test</label>
                  <Input
                    id="test"
                    value={test}
                    onChange={(e) => setTest(e.target.value)}
                    placeholder="Blood Test"
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button
                    className="text-sm h-9 rounded-md px-4"
                    onClick={() => SaveAndAddMore()}
                  >
                    Save & Add More
                  </Button>
                  <Button
                    className="text-sm h-9 rounded-md px-4"
                    onClick={() => SaveAndClose()}
                  >
                    Save & Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
      </div>
      <hr></hr>
      <div className="text-sm">
        {testList.map((test, index) => (
          <div className="p-3" key={index}>
            <div className="flex justify-between items-center">
              <p
                className="flex items-center gap-2 hover:underline hover:text-green-600"
                onClick={() => openUploadedFile(test)}
              >
                <div className="flex items-center ">
                  <Dot />
                  <span>{test.name}</span>
                </div>
                <div>
                  <Paperclip size={13} />
                </div>
              </p>
              <div className="flex gap-2">
                {role === "doctor" &&
                  isToday(
                    appointment?.date ? new Date(appointment.date) : undefined
                  ) && (
                    <Dialog>
                      <DialogTrigger>
                        <Minus
                          size={24}
                          className="border border-red-500 rounded-full p-1"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <span className="text-md font-semibold">
                          {" "}
                          Delete Test{" "}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          The deletion of record also delete the file of the
                          test
                        </p>
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="destructive"
                            className="text-sm h-9 rounded-md px-4"
                            onClick={() => {
                              DeleteTest(test.id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                <Dialog>
                  <DialogTrigger>
                    <FilePlus2
                      size={24}
                      className="border border-yellow-500 rounded-full p-1"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <div className="grid w-full items-center gap-1.5 ">
                      <Label htmlFor="picture" className="font-semibold">
                        Test Result File
                      </Label>
                      <span className="text-red-500 text-xs font-medium">
                        {" "}
                        The images of the test should be in a single file{" "}
                      </span>

                      <input
                        type="file"
                        id="picture"
                        onChange={handleFileChange}
                        className="m-0 my-2 w-full min-w-full flex-auto cursor-pointer rounded border border-muted-foreground bg-transparent bg-clip-padding px-3 py-[0.32rem] text-sm font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white file:dark:text-white"
                      />
                      <div className="flex justify-end">
                        <Button
                          className="text-sm h-9 rounded-md px-4"
                          onClick={() => UploadImage(test.id)}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
