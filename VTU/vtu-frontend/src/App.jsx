import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Airtime from "./pages/Airtime";
import AirtimeConfirm from "./pages/AirtimeConfirm";
import TransactionSuccess from "./pages/TransactionSuccess";
import Data from "./pages/Data";
import DataConfirm from "./pages/DataConfirm";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airtime"
            element={
              <ProtectedRoute>
                <Airtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airtime-confirm"
            element={
              <ProtectedRoute>
                <AirtimeConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-success"
            element={
              <ProtectedRoute>
                <TransactionSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute>
                <Data />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-confirm"
            element={
              <ProtectedRoute>
                <DataConfirm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
