import { Routes, Route } from "react-router-dom";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/lading-page";
import Inbox from "./pages/inbox";
import Calendar from "./pages/calendar";
import Search from "./pages/search";
import Settings from "./pages/settings";
import Resources from "./pages/resources";
import ProtectedLayout from "./protected-layout";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
