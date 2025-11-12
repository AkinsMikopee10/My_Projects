import { useEffect, useState } from "react";

const StatsCard = ({ tasks, focusTime }) => {
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    setTasksCompleted(tasks.filter((t) => t.completed).length);
  }, [tasks]);

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-around items-center">
      <div className="text-center mb-4 md:mb-0">
        <h3 className="text-lg font-semibold">Tasks Completed</h3>
        <p className="text-2xl">{tasksCompleted}</p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Focus Time</h3>
        <p className="text-2xl">{Math.floor(focusTime / 60)} min</p>
      </div>
    </div>
  );
};

export default StatsCard;
