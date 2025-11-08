import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const App = () => {
  // State to hold all todos
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Store filter type (all, active, completed)
  const [filter, setFilter] = useState("all");

  // save todos every time they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // function to add a new todo
  const addTodo = (newTodo) => {
    // ignore empty input
    if (newTodo.trim() === "") return;

    // create new todo items
    const todoItem = {
      id: Date.now(), //unique ID
      text: newTodo,
      completed: false,
    };

    // add to the list
    setTodos([todoItem, ...todos]);
  };

  // function to delete a todo item by ID
  const deleteTodo = (id) => {
    // filter out the one we want to remove
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // function to toggle completed status
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // function to edit todo text
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center p-6 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          📝 My Todo List
        </h1>

        {/* input section */}
        <TodoInput addTodo={addTodo} />

        {/* ✅ Filter Buttons */}
        <div className="flex justify-center gap-2 mt-4 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              } `}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* todo list section */}
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
          editTodo={editTodo}
        />

        {/* Optional Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Built using React + TailwindCSS
        </p>
      </div>
    </div>
  );
};

export default App;
