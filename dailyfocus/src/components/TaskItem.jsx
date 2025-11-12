const TaskItem = ({ task, deleteTask, toggleTask }) => {
  return (
    <li className="flex justify-between items-center p-2 border rounded">
      <span
        role="button"
        tabIndex={0}
        onClick={() => toggleTask(task.id)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && toggleTask(task.id)
        }
        className={`flex-1 cursor-pointer ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.name}
      </span>
      <button
        onClick={() => deleteTask(task.id)}
        aria-label={`Delete ${task.name}`}
        className="text-red-500 font-bold"
      >
        X
      </button>
    </li>
  );
};

export default TaskItem;
