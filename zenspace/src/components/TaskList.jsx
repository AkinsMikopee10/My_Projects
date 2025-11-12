import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

function TaskList({ setCompletedTasks }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("zenspace-tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("zenspace-tasks", JSON.stringify(tasks));
    if (setCompletedTasks)
      setCompletedTasks(tasks.filter((t) => t.completed).length);
  }, [tasks, setCompletedTasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([{ id: Date.now(), text: input, completed: false }, ...tasks]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 col-span-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Today's Tasks
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addTask}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one to get started!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;
