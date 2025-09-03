import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login/Login.js';
import Dashboard from './Dashboard/Dashboard.js';
import OKTALogin from './Login/OKTALogin.js';
import PATLogin from './Login/PATLogin.js';
import LandingPage from './LandingPage/LandingPage.js';
import DashboardLandingPage from './DashboardLandingPage/DashboardLandingPage.js';
import './App.css';
import DashboardWithWritebackExtension from './Dashboard/DashboardWithWritebackExtension.js';

function App() {
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");

    const saveToken = (newToken) => {
        localStorage.setItem("jwtToken", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setToken("");
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={token ? <Navigate to="/landingpage" replace /> : <Login onLogin={saveToken} />} />
                {/* <Route path="/login" element={ token ? <Navigate to="/dashboard" replace /> : <OKTALogin onLogin={saveToken} /> } /> */}
                {/* <Route path="/login" element={ token ? <Navigate to="/dashboard" replace /> : <PATLogin onLogin={saveToken} /> } /> */}
                <Route path="/landingpage" element={token ? <LandingPage token={token} setToken={setToken} onLogout={logout} /> : <Navigate to="/login" replace />} />
                <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} onLogout={logout} /> : <Navigate to="/login" replace />} />
                  <Route path="/dashboardwithextension" element={token ? <DashboardWithWritebackExtension token={token} setToken={setToken} onLogout={logout} /> : <Navigate to="/login" replace />} />
                <Route path="/dashboardlandingpage" element={<DashboardLandingPage />} />
                <Route path="*" element={<Navigate to={token ? "/landingpage" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
