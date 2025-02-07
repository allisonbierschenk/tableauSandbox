import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login/Login.js';
import Dashboard from './Dashboard/Dashboard.js';
import OKTALogin from './Login/OKTALogin.js';
import PATLogin from './Login/PATLogin.js'
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");

    const saveToken = (newToken) => {
        localStorage.setItem("jwtToken", newToken);
        setToken(newToken);
    };

    return (
        <Router>
            <TokenHandler setToken={saveToken} />
            <Routes>
                <Route path="/login" element={ token ? <Navigate to="/dashboard" replace /> : <OKTALogin onLogin={saveToken} /> } />
                {/* <Route path="/login" element={ token ? <Navigate to="/dashboard" replace /> : <PATLogin onLogin={saveToken} /> } /> */}
                <Route path="/dashboard" element={ token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" replace /> } />
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

function TokenHandler({ setToken }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) {
            console.log('JWT Token:', token);
            console.log('Link to decode JWT: https://jwt.io/#debugger-io?token=' + token);
            setToken(token);
            navigate("/dashboard", { replace: true }); // Remove token from URL
        }
    }, [location, setToken, navigate]);

    return null;
}

export default App;
