import React, { useState, useEffect } from 'react';

function OKTALogin({ onLogin }) {
    const [error, setError] = useState(null);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
    
        console.log("🔹 Token from URL:", token); // Check if token exists in the URL
        console.log("🔍 Full URL:", window.location.href);

        if (token) {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            console.log("🔹 Token from URL:", token);
            onLogin(token);
    
            // Remove token from URL
            window.history.replaceState({}, document.title, "/dashboard");
        } else {
            const storedToken = localStorage.getItem("jwtToken");
            console.log("🔹 Stored Token:", storedToken); // Debug stored token
            if (storedToken) {
                onLogin(storedToken);
            }
        }
    }, [onLogin]);

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get("token");

    //     if (token) {
    //         localStorage.setItem("jwtToken", token);
    //         onLogin(token);
    //         console.log("✅ JWT Token:", token);

    //         // Remove token from URL
    //         window.history.replaceState({}, document.title, "/dashboard");
    //     }
    // }, []);

    const handleLogin = () => {
        window.location.href = process.env.REACT_APP_AUTH_SERVER + "/login"; // Redirect to Okta
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <button onClick={handleLogin} className="btn btn-primary w-100">Login with Okta</button>
        </div>
    );
}

export default OKTALogin;
