import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  GET_APPOINTMENT_COUNT,
  GET_APPOINTMENT_COUNT_BY_YEAR,
  GET_AVERAGE_RATING,
  GET_DEPARTMENT,
  GET_DOCTOR_COUNT,
  GET_DOCTOR_PERFORMANCE,
  GET_PATIENT_COUNT,
  GET_UNIQUE_YEARS,
  GET_USER_GENDER_DISTRIBUTION,
} from "@/constants/API";
import useAuth from "@/context/AuthContext";
import { CalendarCheck, Contact, Star, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Tooltip,
  Line,
} from "recharts";

const AdminHomeContent = () => {
  const { role } = useAuth();

  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [averageRating, setAverageRating] = useState(0.5);

  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("2024");
  const [data, setData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [department, setDepartment] = useState("Neurology");

  const COLORS = ["#0e612b", "#a85893", "#a39e16"];

  useEffect(() => {
    //get patients count
    client
      .get(GET_PATIENT_COUNT)
      .then((res) => {
        setTotalPatients(res.data.patient_count);
      })
      .catch((err) => {
        console.log(err);
      });

    //get doctors
    client
      .get(GET_DOCTOR_COUNT)
      .then((res) => {
        setTotalDoctors(res.data.doctor_count);
      })
      .catch((err) => {
        console.log(err);
      });

    //get appointments
    client
      .get(GET_APPOINTMENT_COUNT)
      .then((res) => {
        setTotalAppointments(res.data.appointment_count);
      })
      .catch((err) => {
        console.log(err);
      });

    //get average rating
    client
      .get(GET_AVERAGE_RATING)
      .then((res) => {
        setAverageRating(res.data.average_rating);
      })
      .catch((err) => {
        console.log(err);
      });

    //get unique years
    client
      .get(GET_UNIQUE_YEARS)
      .then((res) => {
        setYearList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //get gender data
    client
      .get(GET_USER_GENDER_DISTRIBUTION)
      .then((res) => {
        console.log(res.data);
        setGenderData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //get department data
    client
      .get(GET_DEPARTMENT)
      .then(function (res) {
        setDepartmentList(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    client
      .get(GET_APPOINTMENT_COUNT_BY_YEAR + year)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [year]);

  useEffect(() => {
    client.get(GET_DOCTOR_PERFORMANCE + department).then((res) => {
      console.log(res.data);
      setPerformanceData(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, [department]);

  return (
    <div className="p-4 ">
      <div className="ml-2 mb-4">
        <span className="text-md font-semibold">
          {" "}
          Welcome! You are logged in as {role}{" "}
        </span>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between gap-5">
            {/* label */}
            <p className="text-xs text-muted-foreground">Total Patients</p>
            {/* icon */}
            <Contact className="h-4 w-4 text-gray-400" />
            {/* <props.icon className="h-4 w-4 text-gray-400" /> */}
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{totalPatients}</h2>
            {/* <p className="text-xs text-gray-500">{props.discription}</p> */}
          </section>
        </CardContent>

        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between gap-5">
            {/* label */}
            <p className="text-xs text-muted-foreground">Total Doctors</p>
            {/* icon */}
            <Stethoscope className="h-4 w-4 text-gray-400" />
            {/* <props.icon className="h-4 w-4 text-gray-400" /> */}
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{totalDoctors}</h2>
            {/* <p className="text-xs text-gray-500">{props.discription}</p> */}
          </section>
        </CardContent>

        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between">
            {/* label */}
            <p className="text-xs text-muted-foreground ">Total Appointments</p>
            <CalendarCheck className="h-4 w-4 text-gray-400 " />
            {/* icon */}
            {/* <props.icon className="h-4 w-4 text-gray-400" /> */}
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{totalAppointments}</h2>
            {/* <p className="text-xs text-gray-500">{props.discription}</p> */}
          </section>
        </CardContent>

        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between gap-5">
            {/* label */}
            <p className="text-xs text-muted-foreground">Average Rating</p>
            {/* icon */}
            <Star className="h-4 w-4 text-gray-400" />
            {/* <props.icon className="h-4 w-4 text-gray-400" /> */}
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">
              {averageRating.toFixed(1)}<span className="text-muted-foreground">/5.0</span>
            </h2>
            {/* <p className="text-xs text-gray-500">{props.discription}</p> */}
          </section>
        </CardContent>
      </div>
      <div className="mt-3">
        <CardContent className="border rounded-md p-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <span className="text-md pl-3 font-semibold text-muted-foreground">
              Total Appointments of {year}{" "}
            </span>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-1/2 sm:w-1/3 lg:w-1/4">
                {year || "Select year"}
              </SelectTrigger>

              <SelectContent>
                {yearList?.map((year) => (
                  <SelectItem key={year} value={year} className="py-2">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Input type="month" placeholder="Search" className="w-1/2 sm:w-1/3 lg:w-1/4" value={year} onChange={(e) => setYear(e.target.value)}/> */}
          </div>
          <ResponsiveContainer width="100%" height={430} className="p-0 mt-5">
            <LineChart width={500} height={300} data={data}>
              <XAxis dataKey="name" className="text-xs" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="no_of_appointments"
                stroke="#16a348"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <CardContent className="lg:col-span-2 p-3 border rounded-md">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <span className="text-md pl-3 font-semibold text-muted-foreground">
              Doctor Performances  of {department} department{" "}
            </span>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-1/2 sm:w-1/3 lg:w-1/4">
                {department || "Select Department"}
              </SelectTrigger>

              <SelectContent className="h-[200px]">
              {departmentList?.map((department) => (
                <SelectItem
                  key={department.id}
                  value={department.department_name}
                  className="py-2"
                >
                  {department.department_name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
            {/* <Input type="month" placeholder="Search" className="w-1/2 sm:w-1/3 lg:w-1/4" value={year} onChange={(e) => setYear(e.target.value)}/> */}
          </div>
          <ResponsiveContainer width="100%" height={480} className="mt-5">
            <BarChart data={performanceData} className="pb-8">
              <XAxis
                dataKey="doctor"
                className="text-sm"
              ></XAxis>
              <YAxis>
              </YAxis>

              <Legend />

              <Bar dataKey="average_rating" fill="#16A349" barSize={80}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardContent className="border rounded-md p-3 lg:col-span-1">
          <span className="text-md pl-3 font-semibold text-muted-foreground">
            Gender Distribution of Users
          </span>
          <ResponsiveContainer width="100%" height={480} className="p-0 ">
            <PieChart width={500}>
              <Pie
                data={genderData}
                cx={150}
                cy={190}
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="number"
                stroke="none"
              >
                {genderData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </div>
    </div>
  );
};

function AdminHomePage() {
  return <PageBuilder mainContent={<AdminHomeContent />} />;
}

export default AdminHomePage;
