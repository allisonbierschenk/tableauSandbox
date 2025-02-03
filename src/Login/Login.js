import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleLogin(event) {
        event.preventDefault();
        try {
            // Send login request to the Go server
            const response = await fetch('http://localhost:3333/tableau-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
                // use with go server
                // body: JSON.stringify({
                //     credentials: {
                //         name: username,  // Use 'name' instead of 'username'
                //         password,  // password field
                //         site: {
                //             contentUrl: 'eacloud'  // Your actual site content URL
                //         }
                //     }
                // })
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            const jwtToken = data.jwtToken;

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
                        value={username}
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
                        value={password}
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
