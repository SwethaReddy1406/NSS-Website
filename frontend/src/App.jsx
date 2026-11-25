
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicActivities from "./pages/PublicActivities";
import Home from "./pages/Home";
import About from "./pages/About";
import Units from "./pages/Units";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Activities from "./pages/Activities";
import UnitsManagement from "./pages/UnitsManagement";
import Events from "./pages/Events";
import VolunteerManagement from "./pages/VolunteerManagement";
import Attendance from "./pages/Attendance";
import Notifications from "./pages/dashboard/Notifications";
import ContactMessages from "./pages/dashboard/ContactMessages";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerProtectedRoute from "./pages/VolunteerProtectedRoute";
import ActivateVolunteer from "./pages/ActivateVolunteer";
import PublicRegistration from "./pages/PublicRegistration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/units" element={<Units />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<PublicRegistration />} />

        <Route path="/login" element={<Login />} />
        <Route path="/activate" element={<ActivateVolunteer />} />
<Route path="/activities" element={<PublicActivities />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/volunteer-dashboard"
  element={
    <VolunteerProtectedRoute>
      <VolunteerDashboard />
    </VolunteerProtectedRoute>
  }
/>
<Route
  path="/dashboard/activities"
  element={
    <ProtectedRoute>
      <Activities />
    </ProtectedRoute>
  }
/>
        
        <Route
          path="/units-management"
          element={
            <ProtectedRoute>
              <UnitsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteers"
          element={
            <ProtectedRoute>
              <VolunteerManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dashboard/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
      
        <Route
          path="/dashboard/contact-messages"
          element={
            <ProtectedRoute>
              <ContactMessages />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

