import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useAuth from "@/context/AuthContext";
import { Plus, Text } from "lucide-react";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/theme-provider";
import { Toaster, toast } from "sonner";
import { DepartmentFormContent } from "./department-form";
import { GET_CREATE_DEPARTMENT, GET_DOCTORS } from "@/constants/API";
import { useNavigate } from "react-router-dom";


const DepartmentContent = () => {
  const [departmentList, setDepartmentList] = useState<Department[] | null>(
    null
  );
  const [id, setID] = useState(0);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [overview, setOverview] = useState("");
  const [updateRequest, setUpdateRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const { role } = useAuth();
  const { theme } = useTheme();

  const [doctorList, setDoctorList] = useState<Doctor[]>([]);

  const navigate = useNavigate();


  async function getDepartments() {
    try {
      const response = await client.get(GET_CREATE_DEPARTMENT);
      if (response.status === 200) {
        setDepartmentList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDepartments();
  }, []);

  async function UpdateDepartmentHandler(id: number) {
    try {
      const url = GET_CREATE_DEPARTMENT + "/" + id;
      const response = await client.get(url);
      if (response.status === 200) {
        setUpdateRequest(true);
        setID(id);
        setName(response.data.department_name);
        setDesc(response.data.department_description);
        response.data.department_overview
          ? setOverview(response.data.department_overview)
          : setOverview(
              'Default value: "Should have overview of department " '
            );
        setOpen(true);
      }
    } catch (error) {
      console.log("Error on update: ", error);
    }
  }

  async function DeleteDepartment(id: number) {
    try {
      const url = GET_CREATE_DEPARTMENT + "/" + id;
      const response = await client.delete(url);
      if (response.status === 204) {
        getDepartments();
        toast.success("Record deleted!");
      }
    } catch (error) {
      console.log("Error while deletion", error);
    }
  }

  function fetchDoctors(dname: string) {
      const url = GET_DOCTORS + "/" + dname
      client.get(url).then(
        function(res){
          console.log(res.data)
          setDoctorList(res.data)
        }
      ).catch(function(err){
        console.log(err);
      })
  }
  function Navigate(){
    if (role === "admin"){
      navigate('../admin/appointments/')  
    }
    navigate('../book/appointments/')  
  }

  return (
    <div className="mx-3 lg:mx-6">
      <div className="header flex justify-between items-center">
        <span className="text-lg font-semibold sm:text-xl"> Departments</span>
        {role === "admin" ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-xs h-8 md:text-sm md:h-full"
              >
                {" "}
                <Plus className="mr-2 h-3 w-3" /> Add Department{" "}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={
                "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
              }
            >
              <DepartmentFormContent
                setOpen={() => setOpen(false)}
                getDepartments={getDepartments}
                name={name}
                setName={setName}
                desc={desc}
                setDesc={setDesc}
                overview={overview}
                setOverview={setOverview}
                updateRequest={updateRequest}
                id={id}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <></>
        )}
      </div>
      <div className="cards py-2 grid gap-4 items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-64 lg:gap-5 ">
        {departmentList &&
          departmentList.map((department, index) => (
            <div
              key={index}
              className={`flex justify-center items-center  rounded-md
              ${
                theme === "dark"
                  ? "bg-[url('@/assets/images/bg-dark.jpg')] bg-cover"
                  : "bg-[url('@/assets/images/bg-light.jpg')] bg-cover"
              }
            `}
            >
              <Card
                className={`w-5/6 h-60 flex items-center pl-14 
              ${
                theme === "dark"
                  ? "bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 w-full "
                  : " bg-green-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 w-full"
              }
              ${role === "admin" ? "justify-between " : ""}
               lg:w-full lg:grid-cols-5`}
              >
                <CardHeader className="p-0  rounded-md lg:col-span-2"></CardHeader>
                <CardContent className="col-span-3  w-full h-full grid grid-cols-1 grid-rows-4  lg:col-span-3 ">
                  <h1 className="text-lg font-medium row-span-2 flex items-end">
                    {department.department_name}
                    <div className="absolute rounded-sm bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-green-400 to-teal-400"></div>
                  </h1>
                  <CardDescription className="">
                    {department.department_description}
                  </CardDescription>

                  <Dialog>
                    <DialogTrigger
                      className="pt-2 text-sm flex gap-2 items-center hover:underline hover:text-green-600
                    " onClick={() => fetchDoctors(department.department_name)}>
                      Learn More <Text size={12} />
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-screen-xl mx-auto w-5/6 rounded-sm max-h-[calc(100vh - 250px)] overflow-y-scroll h-[650px] md:h-[700px]">
                      <div className="wrapper flex flex-col gap-3">
                        <div className="header">
                          <div className="text-2xl font-semibold">
                            {department.department_name}
                          </div>
                          <div className="text-sm">
                            {department.department_description}
                          </div>
                        </div>
                        <div className="">
                          <Card className="p-0 m-0">
                            <CardContent className="m-0 p-4 font-thin text-justify  tracking-wider leading-relaxed">
                                {department.department_overview}
                            </CardContent>
                          </Card>
                        </div>
                        <div>
                        <Card className="p-0 m-0">
                            <CardContent className="m-0 px-4 py-2 flex flex-col gap-2">
                              <span className="text-lg font-semibold">
                               Doctors
                              </span>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                                {doctorList && doctorList.map((doctor, index) => (
                                  <Card key={index} className="p-0 m-0 border-green-600 hover:border-green-400">
                                  <CardContent className="m-0 p-2 flex flex-col gap-1 py-4 text-sm">
                                     <div className="text-center">
                                          {doctor.full_name}
                                     </div>
                                     <div className="text-center text-muted-foreground">
                                          {doctor.qualification}
                                     </div>
                                     <div className="flex justify-center">
                                        <Button className=" w-3/4 m-2 text-center" onClick={() => Navigate()}>
                                            Book an Appointment
                                        </Button>
                                     </div>
                                      
                                  </CardContent>
                                </Card>
                                ))}
                             
                              </div>
                         
                            </CardContent>
                          </Card>
                        </div>
                        
                      
                      </div>
                      
                    </DialogContent>
                  </Dialog>

                  {/* You can add more content here if needed */}
                </CardContent>
                {role === "admin" ? (
                  <CardFooter className="h-full  flex flex-col justify-center items-center gap-3  m-0 p-0 pr-3">
                    <div className="edit">
                      <Button
                        className="w-16 bg-yellow-600 text-white hover:bg-yellow-700"
                        onClick={() => UpdateDepartmentHandler(department.id)}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="del">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-16">
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className={
                            "w-4/5 rounded-sm lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                          }
                        >
                          <div className=" ">
                            <div className="r">
                              <h1 className="text-base font-light sm:text-lg">
                                Do you want to delete this record?{" "}
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
                                onClick={() => DeleteDepartment(department.id)}
                              >
                                Delete
                              </Button>
                              
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                  
                ) : (
                  <></>
                )}
              </Card>
              <Toaster position="top-right" theme="system" richColors />
            </div>
          ))}
          
      </div>
    </div>
  );
};

function DepartmentPage() {
  return <PageBuilder mainContent={<DepartmentContent />} />;
}

export default DepartmentPage;
