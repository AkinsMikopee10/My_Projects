import { useState } from "react";

const TodoInput = ({ addTodo }) => {
  const [inputValue, setInputValue] = useState(""); // state to hold input value

  // function to run at button submit/click action
  const handleSubmit = (e) => {
    e.preventDefault(); // this prevents browser refresh when button is clicked
    addTodo(inputValue); // this sends the data to App.jsx
    setInputValue(""); // this clears the input after submission
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 mb-6 w-full max-w-md"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task...."
        className="flex-grow p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
};

export default TodoInput;
