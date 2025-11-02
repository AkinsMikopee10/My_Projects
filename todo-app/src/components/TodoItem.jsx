const TodoItem = ({ todo, deleteTodo }) => {
  return (
    <li className="flex justify-between items-center p-2 border-b last:border-none">
      {/* todo text */}
      <span className="text-gray-700">{todo.text}</span>

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
