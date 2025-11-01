import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../action/auth"; // Create/register action in Redux

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(register({ name, email, password }));
};


  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Create Account</h1>
        <p className="signin-subtitle">Sign up to start using Your-Tube</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signin-input"
          />
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
            Sign Up
          </button>
        </form>

        <p className="signin-footer">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
