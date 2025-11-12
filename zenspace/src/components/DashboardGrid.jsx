import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import FocusTimer from "./FocusTimer";
import StatsCard from "./StatsCard";
import { motion } from "framer-motion";

function DashboardGrid() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(0);

  useEffect(() => {
    const savedTasks = localStorage.getItem("zenspace-tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const done = tasks.filter((t) => t.completed).length;
      setCompletedTasks(done);
    }
    const savedFocus = localStorage.getItem("zenspace-focus-minutes");
    if (savedFocus) setFocusMinutes(parseInt(savedFocus));
  }, []);

  const handleFocusEnd = (minutesFocused) => {
    const newTotal = focusMinutes + minutesFocused;
    setFocusMinutes(newTotal);
    localStorage.setItem("zenspace-focus-minutes", newTotal);
  };

  return (
    <motion.main
      className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {" "}
      <TaskList setCompletedTasks={setCompletedTasks} />
      <FocusTimer onSessionEnd={handleFocusEnd} />
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 col-span-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Stats Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard title="Tasks Completed" value={completedTasks} />
          <StatsCard title="Focus Time" value={`${focusMinutes} min`} />
          <StatsCard
            title="Streak"
            value="🔥 3 days"
            subtitle="Keep it going!"
          />
        </div>

        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((completedTasks / 5) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Daily Progress ({completedTasks}/5 tasks completed)
        </p>
      </div>
    </motion.main>
  );
}

export default DashboardGrid;
