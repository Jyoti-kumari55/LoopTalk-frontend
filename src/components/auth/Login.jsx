import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const { data } = await axios.post("http://localhost:5001/auth/login", {
        username,
        password,
      });
      setUser(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in";
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md py-12 text-center">
      <div className="px-12">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <p className="text-gray-600 mb-4">
          Login with your credentials to continue.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full text-lg px-4 py-3 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full text-lg px-4 py-3 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        <button
          className="w-full bg-green-600 hover:bg-green-400 text-white font-medium py-3 px-4 rounded-md text-lg mt-3 transition-colors duration-200"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
