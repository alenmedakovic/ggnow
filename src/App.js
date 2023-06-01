import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateThread from "./utils/CreateThread";
import AccountDashboard from "./components/AccountDashboard";
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/createthread" element={<CreateThread />} />
          <Route path="/account" element={<AccountDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
