const TodoItem = ({ todo, deleteTodo, toggleComplete }) => {
  return (
    <li className="flex justify-between items-center p-2 border-b last:border-none">
      {/* Left side: checkbox + text */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />
        {/* todo text */}
        <span
          className={`${
            todo.completed ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {todo.text}
        </span>
      </div>

      {/* delete button */}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="bg-red-500 hover:bg-red-700 text-white font-medium border px-4 py-2 rounded-3xl "
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
