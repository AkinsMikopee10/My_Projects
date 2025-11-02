import { useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const App = () => {
  // State to hold all todos
  const [todos, setTodos] = useState([]);

  // function to add a new todo
  const addTodo = (newTodo) => {
    // ignore empty input
    if (newTodo.trim() === "") return;

    // create new todo items
    const todoItem = {
      id: Date.now(), //unique ID
      text: newTodo,
    };

    // add to the list
    setTodos([todoItem, ...todos]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col item-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📝 My Todo List</h1>

      {/* input section */}
      <TodoInput addTodo={addTodo} />

      {/* todo list section */}
      <TodoList todos={todos} />
    </div>
  );
};

export default App;
