import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Login from "./Auth/Login.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import CreateAccount from "./Auth/CreateAccount.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";
import { AuthProvider } from "./Context/AuthContext";
import ResetSuccess from "./ResetSuccess.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/resetsuccess" element={<ResetSuccess />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
