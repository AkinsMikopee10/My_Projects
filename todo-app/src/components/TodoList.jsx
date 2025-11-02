import TodoItem from "./TodoItem";

const TodoList = ({ todos, deleteTodo, toggleComplete }) => {
  return (
    <div className="w-full max-w-md bg-white p-4 rounded-lg shadow">
      {todos.length === 0 ? (
        <p className="text-gray-400 text-center italic">
          No tasks yet - add your first one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo} //pass function to TodoItem
              toggleComplete={toggleComplete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
