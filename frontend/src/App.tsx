import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateBug from "./pages/CreateBug";
import BugDetails from "./pages/BugDetails";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>

        <BrowserRouter>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,

              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
              },

              success: {
                duration: 3000,
              },

              error: {
                duration: 4000,
              },
            }}
          />

          <Routes>

            {/* ================= HOME ================= */}

            <Route
              path="/"
              element={<Home />}
            />


            {/* ================= PUBLIC ROUTES ================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ================= PROTECTED ROUTES ================= */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-bug"
              element={
                <ProtectedRoute>
                  <CreateBug />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bugs/:bugId"
              element={
                <ProtectedRoute>
                  <BugDetails />
                </ProtectedRoute>
              }
            />


            {/* ================= UNKNOWN ROUTES ================= */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </BrowserRouter>

      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;