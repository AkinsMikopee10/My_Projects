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
import Cable from "./pages/Cable";
import CableConfirm from "./pages/CableConfirm";
import Electricity from "./pages/Electricity";
import ElectricityConfirm from "./pages/ElectricityConfirm";
import ElectricitySuccess from "./pages/ElectricitySuccess";
import Transactions from "./pages/Transactions";
import Receipt from "./pages/Receipt";

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
          <Route
            path="/transaction-success"
            element={
              <ProtectedRoute>
                <TransactionSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cable"
            element={
              <ProtectedRoute>
                <Cable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cable-confirm"
            element={
              <ProtectedRoute>
                <CableConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/electricity"
            element={
              <ProtectedRoute>
                <Electricity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/electricity-confirm"
            element={
              <ProtectedRoute>
                <ElectricityConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/electricity-success"
            element={
              <ProtectedRoute>
                <ElectricitySuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipt/:id"
            element={
              <ProtectedRoute>
                <Receipt />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
