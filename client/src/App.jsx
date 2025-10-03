import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import ForgetPassword from "./pages/Forgetpassword";
import { Reset } from "./pages/Resetpassword";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoutes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
          <Routes>
            {/* 🔓 Public Routes (sirf non-logged in users ke liye) */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <PublicRoute>
                  <Verification />
                </PublicRoute>
              }
            />
            <Route
              path="/forgetpassword"
              element={
                <PublicRoute>
                  <ForgetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/resetPassword"
              element={
                <PublicRoute>
                  <Reset />
                </PublicRoute>
              }
            />

            {/* 🔒 Private Routes (sirf logged in users ke liye) */}
            <Route
              path="/homepage"
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }
            />

            {/* ❌ Catch-All Route → Agar user galat path likhe */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </>
  );
}

export default App;