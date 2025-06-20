import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/handle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;
    if (!username || !password) {
      handleError("Username and password are required");
      return;
    }
    try {
      const url = `http://localhost:8000/api/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        console.log("navigated");
        login();
        navigate("/");
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };
  const handleForgotPassword = () => {
    alert("Please contact Coding Club for password assistance.");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white p-8 md:p-10 rounded-xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">HAB Admin Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-lg mb-1">Username</label>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={loginInfo.username}
              className="w-full text-base p-2 border-b border-gray-400 focus:border-blue-600 outline-none transition duration-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg mb-1">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
              className="w-full text-base p-2 border-b border-gray-400 focus:border-blue-600 outline-none transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg p-3 cursor-pointer transition duration-300"
          >
            Login
          </button>
        </form>
        <p
          onClick={handleForgotPassword}
          className="text-right mt-4 cursor-pointer text-blue-600 hover:text-blue-700"
        >
          Forgot Password?
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;