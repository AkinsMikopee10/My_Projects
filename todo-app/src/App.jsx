import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const App = () => {
  // State to hold all todos
  const [todos, setTodos] = useState([]);

  // Load saved todos when app first mounts
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col item-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📝 My Todo List</h1>

      {/* input section */}
      <TodoInput addTodo={addTodo} />

      {/* todo list section */}
      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        toggleComplete={toggleComplete}
        editTodo={editTodo}
      />
    </div>
  );
};

export default App;
