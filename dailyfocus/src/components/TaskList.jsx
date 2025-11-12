import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks: propTasks, setTasks: setPropTasks }) => {
  // If parent provides tasks/setTasks use them; fallback to local state for standalone use
  const [tasks, setTasks] = useState(() => {
    return propTasks ?? JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const setGlobalTasks = setPropTasks ?? setTasks;

  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // if parent provided setTasks, keep it in sync
    if (setPropTasks) setPropTasks(tasks);
  }, [tasks, setPropTasks]);

  const addTask = () => {
    const name = taskName.trim();
    if (!name) return; // prevent empty tasks
    const newTask = { id: Date.now(), name, completed: false };
    setTasks(prev => [...prev, newTask]);
    setTaskName("");
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(task => task.id !== id));
  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <div className="flex mb-2">
        <input
          type="text"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Add new task"
          className="border p-2 flex-1 rounded"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="ml-2 bg-blue-500 text-white px-3 rounded">Add</button>
      </div>
      <ul className="space-y-2">
        {tasks.length === 0 && <li className="text-gray-500">No tasks yet — add one.</li>}
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} deleteTask={deleteTask} toggleTask={toggleTask} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
