import { Routes, Route } from "react-router-dom";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/lading-page";
import Calendar from "./pages/calendar";
import Search from "./pages/search";
import Settings from "./pages/settings";
import Resources from "./pages/resources";
import ProtectedLayout from "./protected-layout";
import Facilities from "./pages/facilities";
import ResourceConfigurations from "./pages/resource-configs";
import Appointments from "./pages/appointments";
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
          path="/resource-configurations"
          element={<ResourceConfigurations />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/appointments" element={<Appointments />} />
      </Route>
    </Routes>
  );
}

export default App;
