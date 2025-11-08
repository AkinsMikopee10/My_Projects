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
    <div className="min-h-screen bg-gray-100 flex flex-col item-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📝 My Todo List</h1>

      {/* input section */}
      <TodoInput addTodo={addTodo} />

      {/* ✅ Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-md ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } `}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-1 rounded-md ${
            filter === "active"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded-md ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {/* todo list section */}
      <TodoList
        todos={filteredTodos}
        deleteTodo={deleteTodo}
        toggleComplete={toggleComplete}
        editTodo={editTodo}
      />
    </div>
  );
};

export default App;
