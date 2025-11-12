import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashboardGrid from "./components/DashboardGrid";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <DashboardGrid />
      </div>
    </div>
  );
}

export default App;
