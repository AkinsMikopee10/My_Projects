import { useState } from "react";

const TodoItem = ({ todo, deleteTodo, toggleComplete, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editedText.trim() === "") return;
    editTodo(todo.id, editedText);
    setIsEditing(false);
  };

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

        {/* Show input if editing, else show todo text */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-grow">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              autoFocus
              className="w-full border rounded-md p-1 focus:ring-2 focus:ring-blue-400"
            />
          </form>
        ) : (
          /* Right side: edit + delete */
          <span
            className={`flex-grow ${
              todo.completed ? "line-through text-gray-400" : "text-gray-700"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Right side: edit + delete */}
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium border py-4 px-2 rounded-3xl"
          >
            Edit
          </button>
        )}

        {/* delete button */}
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-medium border px-4 py-2 rounded-3xl "
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
