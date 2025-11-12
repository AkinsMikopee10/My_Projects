import { motion } from "framer-motion";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between bg-white px-4 py-2 rounded-xl mb-2 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <div
        onClick={() => onToggle(task.id)}
        className={`flex items-center gap-2 ${
          task.completed ? "opacity-60 line-through" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="accent-indigo-500"
        />
        <span className="text-gray-700">{task.text}</span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-600 transition"
      >
        ✕
      </button>
    </motion.div>
  );
}

export default TaskItem;
