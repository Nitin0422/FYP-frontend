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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GET_AVG_OXYGEN,
  GET_AVG_SUGAR,
  GET_AVG_WEIGHT,
  GET_BLOODPRESSURE_DISTRIBUTION,
  GET_LATEST_MEDICATIONS,
  GET_LOGGEDIN_PATIENT_NAME,
  GET_OXYGEN_DISTRIBUTION,
  GET_PATIENT_APPOINTMENT_COUNT,
  GET_PATIENT_YEAR,
  GET_PULSE_DISTRIBUTION,
  GET_SUGAR_DISTRIBUTION,
  GET_TOP_DOCTOR,
  GET_TOP_PAINPOINTS,
  GET_TOTAL_TESTS,
  GET_WEIGHT_DISTRIBUTION,
} from "@/constants/API";
import {
  Stethoscope,
  CalendarCheck,
  Gauge,
  Dna,
  Heart,
  Rainbow,
  Dot,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HomePageContent = () => {
  const [patient, setPatient] = useState("");
  const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);
  const [painpoints, setPainpoints] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("2024");

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [testsCount, setTestsCount] = useState(0);
  const [weight, setWeight] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [oxygen, setOxygen] = useState(0);
  const [docName, setDocName] = useState("");

  const [weightData, setWeightData] = useState([]);
  const [oxygenData, setOxygenData] = useState([]);
  const [sugarData, setSugarData] = useState([]);
  const [pulseData, setPulseData] = useState([]);
  const [bpData, setBpData] = useState([]);

  useEffect(() => {
    client
      .get(GET_LOGGEDIN_PATIENT_NAME)
      .then((res) => {
        console.log(res.data);
        setPatient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //appointment count
    client
      .get(GET_PATIENT_APPOINTMENT_COUNT)
      .then((res) => {
        setAppointmentCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });

    //tests count
    client
      .get(GET_TOTAL_TESTS)
      .then((res) => {
        setTestsCount(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });

    //average weight
    client
      .get(GET_AVG_WEIGHT)
      .then((res) => {
        setWeight(res.data.avg_weight);
      })
      .catch((err) => {
        console.log(err);
      });

    //average sugar
    client
      .get(GET_AVG_SUGAR)
      .then((res) => {
        setSugar(res.data.avg_sugar);
      })
      .catch((err) => {
        console.log(err);
      });

    //average oxygen
    client
      .get(GET_AVG_OXYGEN)
      .then((res) => {
        setOxygen(res.data.avg_oxygen);
      })
      .catch((err) => {
        console.log(err);
      });

    //top doctor
    client
      .get(GET_TOP_DOCTOR)
      .then((res) => {
        setDocName(res.data.doctor_name);
      })
      .catch((err) => {
        console.log(err);
      });

    //top three prescriptions
    client
      .get(GET_TOP_PAINPOINTS)
      .then((res) => {
        setPainpoints(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //latest medicaiton
    client
      .get(GET_LATEST_MEDICATIONS)
      .then((res) => {
        setPrescriptionList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    //year list
    client
      .get(GET_PATIENT_YEAR)
      .then((res) => {
        setYearList(res.data.years);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //weight data
    client
      .get(GET_WEIGHT_DISTRIBUTION + year)
      .then((res) => {
        setWeightData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
      //oxygen data
      client.get(GET_OXYGEN_DISTRIBUTION + year).then((res) => {
        setOxygenData(res.data);
      }).catch((err) => {
        console.log(err);
      })
      //sugar data
      client.get(GET_SUGAR_DISTRIBUTION + year).then((res) => {
        setSugarData(res.data);
      }).catch((err) => {
        console.log(err);
      })
      //pulse data
      client.get(GET_PULSE_DISTRIBUTION + year).then((res) => {
        setPulseData(res.data);
      }).catch((err) => {
        console.log(err);
      })
      //bp data
      client.get(GET_BLOODPRESSURE_DISTRIBUTION + year).then((res) => {
        setBpData(res.data);
      }).catch((err) => {
        console.log(err);
      })
  }, [year]);


  
  return (
    <div className="p-4">
      <div className="ml-2 mb-4">
        <span className="text-md font-semibold"> Welcome {patient} !</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        <div className="lg:col-span-2 h-full">
          <div className="grid w-full grid-cols-2 gap-2 transition-all h-full lg:grid-cols-3">
            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between gap-5">
                <p className="text-xs text-muted-foreground">
                  Total Appointments
                </p>
                <CalendarCheck className="h-4 w-4 text-gray-400" />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold pt-2">
                  {appointmentCount}
                </h2>
              </section>
            </CardContent>

            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between gap-5">
                {/* label */}
                <p className="text-xs text-muted-foreground">
                  Most Visited Doctor
                </p>
                {/* icon */}
                <Stethoscope className="h-4 w-4 text-gray-400" />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold pt-2">{docName}</h2>
              </section>
            </CardContent>

            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between">
                <p className="text-xs text-muted-foreground ">Total Tests</p>
                <Dna className="h-4 w-4 text-gray-400 " />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold pt-2">{testsCount}</h2>
              </section>
            </CardContent>

            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between gap-5">
                <p className="text-xs text-muted-foreground">Average Weight</p>
                <Rainbow className="h-4 w-4 text-gray-400" />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold pt-2">
                  {weight}
                  <span className="text-muted-foreground text-lg"> kg</span>
                </h2>
              </section>
            </CardContent>

            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between gap-5">
                {/* label */}
                <p className="text-xs text-muted-foreground">
                  Average Sugar Level
                </p>
                {/* icon */}
                <Gauge className="h-4 w-4 text-gray-400" />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold pt-2">
                  {sugar}
                  <span className="text-muted-foreground text-lg"> mmol/L</span>
                </h2>
              </section>
            </CardContent>

            <CardContent className="border rounded-lg p-4">
              <section className="flex justify-between">
                <p className="text-xs text-muted-foreground ">
                  Average SpO<sub>2</sub> Level
                </p>
                <Heart className="h-4 w-4 text-gray-400 " />
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold pt-2">
                  {oxygen}
                  <span className="text-muted-foreground text-lg"> %</span>
                </h2>
              </section>
            </CardContent>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <div className="lg:col-span-1 border rounded-lg">
            <CardContent className="p-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {" "}
                Top 3 Painpoints
              </span>
              {painpoints.map((painpoint, index) => (
                <span
                  key={index}
                  className="text-[12px] sm:text-sm flex sm:gap-1 mt-2"
                >
                  <Dot /> {painpoint}
                </span>
              ))}
            </CardContent>
          </div>
          <div className="lg:col-span-1 border rounded-lg">
            <CardContent className="p-3 overflow-y-scroll">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {" "}
                Current Medications
              </span>
              <div>
                {prescriptionList.map((prescription, index) => (
                  <span
                    key={index}
                    className="text-[12px] sm:text-sm flex sm:gap-1 mt-2"
                  >
                    <Dot /> {prescription.medication_name}
                    <span className="text-muted-foreground">
                      -{prescription.medication_dosage}
                    </span>
                  </span>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </div>
      <div>
        <Tabs defaultValue="weight" className="w-full mt-3">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="bp">BP</TabsTrigger>
            <TabsTrigger value="oxygen">
              SpO<sub>2</sub>
            </TabsTrigger>
            <TabsTrigger value="sugar">Sugar</TabsTrigger>
            <TabsTrigger value="pulse">Pulse</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <CardContent className="border rounded-md p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <span className="text-md pl-3 font-semibold text-muted-foreground">
                 {patient}'s Weight Distribution in Year {year}{" "}
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
              <ResponsiveContainer
                width="100%"
                height={430}
                className="p-0 mt-5"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={weightData}
                >
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#16a348"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </TabsContent>

          <TabsContent value="bp">
            <CardContent className="border rounded-md p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <span className="text-md pl-3 font-semibold text-muted-foreground">
                  {patient}'s Blood Pressure in Year {year}{" "}
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
              <ResponsiveContainer
                width="100%"
                height={430}
                className="p-0 mt-5"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={bpData}
                >
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#16a348"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="red"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </TabsContent>

          <TabsContent value="oxygen">
          <CardContent className="border rounded-md p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <span className="text-md pl-3 font-semibold text-muted-foreground">
                  {patient}'s SpO<sub>2</sub> in Year {year}{" "}
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
              <ResponsiveContainer
                width="100%"
                height={430}
                className="p-0 mt-5"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={oxygenData}
                >
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="oxygen"
                    stroke="#16a348"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </TabsContent>

          <TabsContent value="sugar">
          <CardContent className="border rounded-md p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <span className="text-md pl-3 font-semibold text-muted-foreground">
                  {patient}'s Blood Sugar Levels in Year {year}{" "}
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
              <ResponsiveContainer
                width="100%"
                height={430}
                className="p-0 mt-5"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={sugarData}
                >
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sugar"
                    stroke="#16a348"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </TabsContent>

          <TabsContent value="pulse">
          <CardContent className="border rounded-md p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <span className="text-md pl-3 font-semibold text-muted-foreground">
                  {patient}'s Pulse Levels in Year {year}{" "}
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
              <ResponsiveContainer
                width="100%"
                height={430}
                className="p-0 mt-5"
              >
                <LineChart
                  width={500}
                  height={300}
                  data={pulseData}
                >
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pulse"
                    stroke="#16a348"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const PatientHomePage = () => {
  return <PageBuilder mainContent={<HomePageContent />} />;
};

export default PatientHomePage;
