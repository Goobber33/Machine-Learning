import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import './App.sass';

function App() {
  const handleLogin = (username: string, password: string) => {
    // Handle login here
  };

  const handleSignup = (username: string, password: string) => {
    // Handle signup here
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Welcome to Our App!</h1>
          <nav className="nav">
            <Link to="/" className="nav-link btn btn-info">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </nav>
          <Routes>
            <Route path="/" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage handleSignup={handleSignup} />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
