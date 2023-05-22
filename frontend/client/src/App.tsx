import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './Login';
import SignupPage from './Signup';
import './App.sass';

function App() {
  const handleLogin = async (username: string, password: string) => {
    const response = await fetch('https://machine-kyle.herokuapp.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      // Handle error
      console.log('Login error');
      return;
    }

    const data = await response.json();
    // Do something with the token, like storing it
  };

  const handleSignup = async (username: string, password: string) => {
    const response = await fetch('https://machine-kyle.herokuapp.com/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      // Handle error
      console.log('Signup error');
      return;
    }

    const data = await response.json();
    // Do something with the data
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
