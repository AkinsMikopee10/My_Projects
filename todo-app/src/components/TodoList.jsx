const TodoList = ({ todos }) => {
  return (
    <div className="w-full max-w-md bg-white p-4 rounded-lg shadow">
      {todos.length === 0 ? (
        <p className="text-gray-400 text-center italic">
          No tasks yet - add your first one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-2 border-b last:border-none text-gray-700"
            >
              {todo.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
