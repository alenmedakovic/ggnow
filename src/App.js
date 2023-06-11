import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import AccountDashboard from "./components/AccountDashboard";
import { ThemeContext } from "./utils/ThemeContext";
import './App.css';

function App() {
  const { isDarkMode } = useContext(ThemeContext);

  const containerStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    color: isDarkMode ? 'white' : 'black',
  };

  return (
    <div> 
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<AccountDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
