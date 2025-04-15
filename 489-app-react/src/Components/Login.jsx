import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer");

  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        navigate(userRole === "buyer" ? "/buyer" : "/seller");
      } else {
        alert("User role not found.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        displayName,
      });

      alert("Account created! You can now log in.");
      setIsRegistering(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>
        <label>Email:</label>
        <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="show-password">
          <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
          <span>Show Password</span>
        </div>

        <button className="login-btn" onClick={handleLogin}>SIGN IN</button>

        <div className="helper-links">
          <p>Forgot <span className="link">Username / Password</span>?</p>
          <p>Don't have an account? <span className="link" onClick={() => setIsRegistering(true)}>Sign up</span></p>
        </div>
      </div>

      {isRegistering && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Create Account</h2>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="role-select">
              <label>
                <input type="radio" value="buyer" checked={role === "buyer"} onChange={() => setRole("buyer")} />
                Buyer
              </label>
              <label>
                <input type="radio" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} />
                Seller
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={handleRegister}>Register</button>
              <button className="cancel" onClick={() => setIsRegistering(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
