import { Routes, Route } from "react-router-dom";
import Signin from "./pages/auth/signin";
import Signup from "./pages/auth/signup";
import LandingPage from "./pages/lading-page";
import Dashboard from "./pages/dashboard";
import Calendar from "./pages/calendar";
import Search from "./pages/search";
import Settings from "./pages/settings";
import Resources from "./pages/appointment-managment/resources";
import ProtectedLayout from "./protected-layout";
import Facilities from "./pages/appointment-managment/facilities";
import ResourceAvailability from "./pages/appointment-managment/resource-availability";
import Appointments from "./pages/appointment-managment/appointments";
import PatientRegistration from "./pages/patient-managment/patient-registration";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/resources" element={<Resources />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route
          path="/resource-availability"
          element={<ResourceAvailability />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
      </Route>
    </Routes>
  );
}

export default App;
