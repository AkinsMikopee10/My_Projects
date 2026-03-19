import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminDataPlans from "./pages/admin/AdminDataPlans";
import AdminCablePlans from "./pages/admin/AdminCablePlans";
import AdminElectricityProviders from "./pages/admin/AdminElectricityProviders";
import AdminFundWallet from "./pages/admin/AdminFundWallet";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import FundWallet from "./pages/FundWallet";
import VerifyPayment from "./pages/VerifyPayment";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User */}
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
          path="/fund-wallet"
          element={
            <ProtectedRoute>
              <FundWallet />
            </ProtectedRoute>
          }
          />
          <Route
            path="/wallet/verify"
            element={
              <ProtectedRoute>
                <VerifyPayment />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <AdminUserDetail />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <AdminRoute>
                <AdminTransactions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/data-plans"
            element={
              <AdminRoute>
                <AdminDataPlans />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cable-plans"
            element={
              <AdminRoute>
                <AdminCablePlans />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/electricity-providers"
            element={
              <AdminRoute>
                <AdminElectricityProviders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/fund-wallet"
            element={
              <AdminRoute>
                <AdminFundWallet />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
