import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GET_CREATE_DEPARTMENT } from "@/constants/API";
import { Label } from "@radix-ui/react-label";

interface DepartmentFormContentProps {
  name?: string;
  desc?: string;
  overview?: string;
  updateRequest?: boolean;
  id?: number;
  setName?: (name: string) => void;
  setDesc?: (desc: string) => void;
  setOverview?: (overview: string) => void;
  setOpen?: () => void;
  getDepartments?: () => void;
}

export const DepartmentFormContent = ({
  name,
  desc,
  overview,
  setName,
  setDesc,
  setOverview,
  setOpen,
  getDepartments,
  id,
  updateRequest,
}: DepartmentFormContentProps) => {
  // const [name, setName] = useState('')
  // const [desc, setDesc] = useState('')
  // const [overview, setOverview] = useState('')

  function clearForm() {
    setName
      ? setName("")
      : console.log("setName function needs to be passed down");
    setDesc
      ? setDesc("")
      : console.log("setDesc function needs to be passed down");
    setOverview
      ? setOverview("")
      : console.log("setOverview function needs to be passed down");
  }

  async function AddDepartment() {
    try {
      const response = await client.post(GET_CREATE_DEPARTMENT + "/" , {
        department_name: name,
        department_description: desc,
        department_overview: overview,
      });
      if (response.status === 201) {
        clearForm();
        getDepartments
          ? getDepartments()
          : console.log("Get Department function not set");
        setOpen ? setOpen() : console.log("Dialog close function not set");
      } else {
        clearForm();
      }
    } catch (error) {
      clearForm();
      console.log("Error on request: ", error);
    }
  }

  async function UpdateDepartment(id: number) {
    try {
      const url = GET_CREATE_DEPARTMENT + "/" + id;
      
      const response = await client.put(url, {
        department_name: name,
        department_description: desc,
        department_overview: overview,
      });
      
      if (response.status == 200) {
        clearForm();
        getDepartments
          ? getDepartments()
          : console.log("Get Department function not set");
        setOpen ? setOpen() : console.log("Dialog close function not set");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid w-full gap-4 text-sm lg:text-base">
      <div className="flex flex-col items-start space-y-2 text-sm">
        <Label htmlFor="department_name" className="">
          Department Name
        </Label>
        <Input
          id="department_name"
          type="text"
          value={name}
          onChange={(e) => {
            setName
              ? setName(e.target.value)
              : console.log("setName function needs to be passed down");
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="department_description">Department Description</Label>
        <Input
          id="department_description"
          type="text"
          value={desc}
          onChange={(e) => {
            setDesc
              ? setDesc(e.target.value)
              : console.log("setDesc function needs to be passed down");
          }}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="department_overview">Department Overview</Label>
        <Textarea
          id="department_overview"
          value={overview}
          onChange={(e) => {
            setOverview
              ? setOverview(e.target.value)
              : console.log("setOverview function needs to be passed down");
          }}
          autoComplete="off"
        />
      </div>
      <div className="w-100 flex justify-end">
        {updateRequest ? (
          <Button
            className=" w-2/6 "
            onClick={() => UpdateDepartment(id ? id : 0)}
          >
            {" "}
            Update{" "}
          </Button>
        ) : (
          <Button className=" w-2/6 " onClick={AddDepartment}>
            {" "}
            Add{" "}
          </Button>
        )}
      </div>
    </div>
  );
};

const DepartmentFormPage = () => {
  return <PageBuilder mainContent={<DepartmentFormContent />} />;
};

export default DepartmentFormPage;
