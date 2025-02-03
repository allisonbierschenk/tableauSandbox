import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login/Login.js';
import Dashboard from './Dashboard/Dashboard.js';
import PATLogin from './Login/PATLogin.js'
import './App.css';

function App() {
    const [token, setToken] = useState('');
    console.log("token", token);

    return (
        <Router>
            <Routes>
                {/* <Route
                    path="/login"
                    element={
                        token ? <Navigate to="/dashboard" /> : <Login onLogin={setToken} />
                    }
                /> */}
                 <Route
                    path="/login"
                    element={
                        token ? <Navigate to="/dashboard" /> : <PATLogin onLogin={setToken} />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to={token ? "/dashboard" : "/login"} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
