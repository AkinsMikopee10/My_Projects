import { useState, useEffect } from "react";

const TodoItem = ({ todo, deleteTodo, toggleComplete, editTodo }) => {
  // Local state for editing mode and the input value
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  // Handle key events for edit mode
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSubmit(e);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedText(todo.text); // revert to old text
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editedText.trim() === "") return;
    editTodo(todo.id, editedText);
    setIsEditing(false);
  };

  // Add a subtle animation for completed items
  useEffect(() => {
    if (todo.completed) {
      const timer = setTimeout(() => {}, 300);
      return () => clearTimeout(timer);
    }
  }, [todo.completed]);

  return (
    <li
      className={`flex justify-between items-center p-2 border-b last:border-none transition-all duration-300 ${
        todo.completed ? "bg-green-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Left side: checkbox + text */}
      <div className="flex items-center space-x-2 w-full">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-grow">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full border rounded-md p-1 focus:ring-2 focus:ring-blue-400"
            />
          </form>
        ) : (
          <span
            className={`flex-grow break-words ${
              todo.completed
                ? "line-through text-gray-400 transition-all duration-300"
                : "text-gray-700"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Right side: edit + delete buttons */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <button
            onClick={handleEditSubmit}
            className="bg-green-600 hover:bg-green-800 text-white font-medium border px-4 py-2 rounded-3xl"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium border px-4 py-2 rounded-3xl"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-medium border px-4 py-2 rounded-3xl"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
