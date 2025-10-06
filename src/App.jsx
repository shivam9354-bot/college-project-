import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./component/Auth/Register";
import Dashboard from "./component/Dashboard/Dashboard";
import ViewMembers from "./pages/ViewMembers";
import UserProfile from "./component/User/UserProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/view-members" element={<ViewMembers />} />
      <Route path="/user/:id" element={<UserProfile />} /> {/* User profile route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
