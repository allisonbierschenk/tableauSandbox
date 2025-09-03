import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
    // Get username and password from environment variables
    const [username, setUsername] = useState(process.env.REACT_APP_USERNAME || '');
    const [password, setPassword] = useState(process.env.REACT_APP_PASSWORD || '');
    const [error, setError] = useState(null);

    async function handleLogin(event) {
        event.preventDefault();
        try {
            // Send login request to the Go server
            const response = await fetch(`${process.env.REACT_APP_AUTH_SERVER}/tableau-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            const jwtToken = data.jwtToken;
            const tableauToken = data.tsAuthInfo.ts_auth_token
            console.log("tableauToken", tableauToken)

            // Store the JWT token in localStorage
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('tableauToken', tableauToken)


            // Pass the JWT token to the parent component (App)
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
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username} // Populating with environment variable, editable
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password} // Populating with environment variable, editable
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
}

export default Login;
