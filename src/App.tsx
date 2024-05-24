import { ThemeProvider } from "@/components/theme-provider";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";

import AdminHomePage from "./pages/admin/home/home";

import { RequireAuth } from "./components/RequireAuth";

import DoctorHomePage from "./pages/doctor/home/home";
import PatientHomePage from "./pages/patient/home/home";
import { BlockLogin } from "./components/BlockLogin";
import { Profile } from "./pages/profile/profile";
import UserDoctorsPage from "./pages/admin/users/doctors/doctors";
import UserPatientsPage from "./pages/admin/users/patients/patients";
import DepartmentPage from "./pages/admin/department/department";
import DepartmentFormPage from "./pages/admin/department/department-form";
import { AppointmentSlotPage } from "./pages/admin/slots/slots";
import { AppointmentPage } from "./pages/admin/appointment/appointment";
import { DoctorAppointmentPage } from "./pages/doctor/appointment/appointment";

import ForgotPassword from "./pages/forgotpassword";
import { SchedulePage } from "./pages/doctor/schedule/schedule";
import { DoctorHistoryPage } from "./pages/doctor/history/history";
import { PatientHistoryPage } from "./pages/patient/history/history";
import { AllAppointmentsPage } from "./pages/admin/appointment/all-appointments";
import { AllArticlesPage } from "./pages/articles/AllArticles";
import { ArticlesPage } from "./pages/articles/Articles";

const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route element={<BlockLogin />}>
              <Route path="/" Component={Login} />
              <Route path="/forgotpassword" Component={ForgotPassword} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin/home" Component={AdminHomePage} />
              <Route path="/users/doctors" Component={UserDoctorsPage} />
              <Route path="/users/patients" Component={UserPatientsPage} />
              <Route path="/department/add" Component={DepartmentFormPage} />
              <Route
                path="/admin/appointment/slots"
                Component={AppointmentSlotPage}
              />
              <Route path="/admin/appointments/" Component={AppointmentPage} />,
              <Route path="/admin/all/appointments" Component={AllAppointmentsPage} />
              {/* Admin Pages go here */}
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.DOCTOR]} />}>
              <Route path="/doctor/home" Component={DoctorHomePage} />
              <Route path="/patients" Component={UserPatientsPage} />
              <Route path="/doctor/schedule" Component={SchedulePage} />
              <Route path="/doctor/history" Component={DoctorHistoryPage} />
              <Route
                path="/doctor/appointments/"
                Component={DoctorAppointmentPage}
              />
              {/* Doctor components go here  */}
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.PATIENT]} />}>
              <Route path="/patient/home" Component={PatientHomePage} />
              <Route path="/doctors" Component={UserDoctorsPage} />
              <Route path="/book/appointments/" Component={AppointmentPage} />
              <Route path="/patient/history" Component={PatientHistoryPage} />
              {/* Patient Components go here  */}
            </Route>
            {/* Common Components can go here  */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[ROLES.ADMIN, ROLES.PATIENT, ROLES.DOCTOR]}
                />
              }
            >
              <Route path="profile" element={<Profile />} />
              <Route path="/articles" element={<ArticlesPage />} />
            </Route>
            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.PATIENT]} />
              }
            >
              <Route path="/departments" Component={DepartmentPage} />
            </Route>
            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR]} />
              }
            >
              <Route path="/all/articles" Component={AllArticlesPage} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
