import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import AdminDashboard from "./AdminDashboard.tsx";
import DeveloperDashboard from "./DeveloperDashboard.tsx";
import ViewerDashboard from "./ViewerDashboard.tsx";


function Dashboard() {
  const {
    user,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }


  if (user.role === "DEVELOPER") {
    return <DeveloperDashboard />;
  }


  if (user.role === "VIEWER") {
    return <ViewerDashboard />;
  }


  return (
    <Navigate
      to="/login"
      replace
    />
  );
}


export default Dashboard;