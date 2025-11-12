import { useState } from "react";
import TaskList from "./components/TaskList";
import FocusTimer from "./components/FocusTimer";
import StatsCard from "./components/StatsCard";

const App = () => {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [focusTime, setFocusTime] = useState(
    () => Number(localStorage.getItem("focusTime")) || 0
  );

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("focusTime", String(focusTime));
  }, [focusTime]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold">DailyFocus</h1>
      </header>
      <main className="space-y-6">
        <TaskList tasks={tasks} setTasks={setTasks} />
        <FocusTimer setFocusTime={setFocusTime} />
        <StatsCard tasks={tasks} focusTime={focusTime} />
      </main>
    </div>
  );
};

export default App;
