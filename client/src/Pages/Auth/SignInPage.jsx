import React, { useState } from "react";
import "./signin.css";
import { useDispatch } from "react-redux";
import { login } from "../../action/auth";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState(""); // popup state
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setPopupMessage("⚠️ Please enter both email and password");
      return;
    }
    dispatch(login({ email, password }));
  };

  const closePopup = () => setPopupMessage("");

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Please sign in to continue</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />
          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>

        <p className="signin-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      {/* ✅ Popup rendering */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
