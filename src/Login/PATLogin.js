import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
    const [tokenName, setTokenName] = useState(process.env.REACT_APP_EMBEDSEUBL_PATNAME ); //current username for embedseubl site
    const [tokenSecret, setTokenSecret] = useState(process.env.REACT_APP_EMBEDSEUBL_PASSWORD); //current password for embedseubl site
    const [error, setError] = useState(null);

        // Check if there's a token in localStorage on page load
        useEffect(() => {
            const savedToken = localStorage.getItem('jwtToken');
            if (savedToken) {
                onLogin(savedToken); // Restore session if token exists
            }
        }, [onLogin]);

    async function handleLogin(event) {
        event.preventDefault();
        try {
            // Send login request to the Go server
            const response = await fetch(`${process.env.REACT_APP_AUTH_SERVER}/tableau-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credentials: { 
                        personalAccessTokenName: tokenName,  
                        personalAccessTokenSecret: tokenSecret,  
                        site: {
                            contentUrl: 'embedseubl' 
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            const jwtToken = data.jwtToken;

            localStorage.setItem('jwtToken', jwtToken);
            onLogin(jwtToken);

            console.log('JWT Token:', jwtToken);
            console.log('Link to decode JWT: https://jwt.io/#debugger-io?token=' + jwtToken);

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to authenticate');
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="tokenName" className="form-label">Personal Access Token Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="tokenName"
                        value={tokenName}
                        onChange={(e) => setTokenName(process.env.REACT_APP_EMBEDSEUBL_PATNAME)}
                        autoComplete="off" 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tokenSecret" className="form-label">Personal Access Token Secret</label>
                    <input
                        type="password"
                        className="form-control"
                        id="tokenSecret"
                        value={tokenSecret}
                        onChange={(e) => setTokenSecret(process.env.REACT_APP_EMBEDSEUBL_PASSWORD)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
}

export default Login;
