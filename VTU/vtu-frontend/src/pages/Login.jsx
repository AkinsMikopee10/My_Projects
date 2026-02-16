import React from "react";

const Login = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Email........"
          className="w-full border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password....."
          className="w-full border p-3 rounded-lg"
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
