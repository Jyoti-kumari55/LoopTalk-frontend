import React, { useState } from "react";
import axios from "axios";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerationSuccess, setRegistrationSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");
      setRegistrationSuccess("");
      const { data } = await axios.post("http://localhost:5001/auth/register", {
        username,
        password,
      });

      setRegistrationSuccess(
        "You are registered successfully. Proceed to login."
      );
      setUser(data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error registering user";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setTimeout(() => {
        setRegistrationSuccess("");
        setError("");
      }, 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md py-12 text-center">
      <div className="px-12">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <p className="text-gray-600 mb-4">Not a user yet? Register here</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full text-lg px-4 py-3 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full text-lg px-4 py-3 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-400 text-white font-medium py-3 px-4 rounded-md text-lg mt-3 transition-colors duration-200"
          onClick={handleRegister}
        >
          Register
        </button>
        {registerationSuccess && (
          <p className="mt-4 text-sm text-gray-700">{registerationSuccess}</p>
        )}
      </div>
    </div>
  );
};

export default Register;
