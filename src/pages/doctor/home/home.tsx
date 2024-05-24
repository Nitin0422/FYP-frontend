import client from "@/axios-config";
import { PageBuilder } from "@/components/PageBuilder";
import {
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  GET_APPOINTMENT_COUNT_BY_DOCTOR,
  GET_APPOINTMENT_DISTRIBUTION_BY_DOCTOR,
  GET_AVG_PATIENT_AGE,
  GET_AVG_RATING_BY_DOCTOR,
  GET_DOCTOR_NAME,
  GET_PATIENT_COUNT_BY_DOCTOR,
  GET_PATIENT_GENDER_DISTRIBUTION,
  GET_UNIQUE_YEARS,
} from "@/constants/API";

import { Contact, Stethoscope, CalendarCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const DoctorHomeContent = () => {
  const [doctor, setDoctor] = useState("");

  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [avgAge, setAvgAge] = useState(0);

  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("2024");

  const [genderData, setGenderData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);

  const COLORS = ["#0e612b", "#a85893", "#a39e16"];

  useEffect(() => {
    client
      .get(GET_DOCTOR_NAME)
      .then((res) => {
        console.log(res.data);
        setDoctor(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //patient count
    client
      .get(GET_PATIENT_COUNT_BY_DOCTOR)
      .then((res) => {
        console.log(res.data.count);
        setPatientCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });

    //appointment count
    client
      .get(GET_APPOINTMENT_COUNT_BY_DOCTOR)
      .then((res) => {
        setAppointmentCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });

    //average rating
    client
      .get(GET_AVG_RATING_BY_DOCTOR)
      .then((res) => {
        setAvgRating(res.data.avg_rating);
      })
      .catch((err) => {
        console.log(err);
      });

    //average age
    client
      .get(GET_AVG_PATIENT_AGE)
      .then((res) => {
        setAvgAge(res.data.avg_age);
      })
      .catch((err) => {
        console.log(err);
      });

    //gender data
    client
      .get(GET_PATIENT_GENDER_DISTRIBUTION)
      .then((res) => {
        setGenderData(res.data);
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
  }, []);

  useEffect(() => {
    client
      .get(GET_APPOINTMENT_DISTRIBUTION_BY_DOCTOR + year)
      .then((res) => {
        console.log(res.data);
        setAppointmentData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [year]);

  return (
    <div className="p-4">
      <div className="ml-2 mb-4">
        <span className="text-md font-semibold"> Welcome Dr.{doctor} !</span>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between gap-5">
            <p className="text-xs text-muted-foreground">Total Patients</p>
            <Contact className="h-4 w-4 text-gray-400" />
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{patientCount}</h2>
          </section>
        </CardContent>

        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between">
            <p className="text-xs text-muted-foreground ">Total Appointments</p>
            <CalendarCheck className="h-4 w-4 text-gray-400 " />
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{appointmentCount}</h2>
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
              {avgRating.toFixed(1)}
              <span className="text-muted-foreground">/5.0</span>
            </h2>
            {/* <p className="text-xs text-gray-500">{props.discription}</p> */}
          </section>
        </CardContent>
        <CardContent className="border rounded-lg p-4">
          <section className="flex justify-between gap-5">
            <p className="text-xs text-muted-foreground">Average Patient Age</p>
            <Stethoscope className="h-4 w-4 text-gray-400" />
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold pt-2">{avgAge}</h2>
          </section>
        </CardContent>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <CardContent className="lg:col-span-2 p-3 border rounded-md">
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
          </div>
          <ResponsiveContainer width="100%" height={430} className="p-0 mt-5">
            <LineChart width={500} height={300} data={appointmentData}>
              <XAxis dataKey="name" className="text-xs" angle={-55} />
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
        <CardContent className="p-3 border rounded-md lg:col-span-1">
          <span className="text-md pl-3 font-semibold text-muted-foreground">
            Gender Distribution of Patients
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

export const DoctorHomePage = () => {
  return <PageBuilder mainContent={<DoctorHomeContent />} />;
};
export default DoctorHomePage;
