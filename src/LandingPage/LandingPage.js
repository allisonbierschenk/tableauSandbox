import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableauPulseEmbed from "../Pulse/Pulse.js"

const LandingPage = ({token, setToken}) => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [tableauToken, setTableauToken] = useState()

    useEffect(() => {
        async function fetchFolders() {
            let tableauToken = localStorage.getItem('tableauToken');
            setTableauToken(tableauToken)
            if (!tableauToken) {
                console.log("No token found in localStorage");
                return;
            }
    
            try {
                const response = await fetch(`${process.env.REACT_APP_AUTH_SERVER}/tableau-folders`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': tableauToken,  
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch folders');
                }
    
                const data = await response.json();
                console.log("Received data:", data);
                console.log("data.nestedProjects[0].children", data.nestedProjects[0].children)
    
                setFolders(data.nestedProjects[0].children);
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        }
    
        fetchFolders();
    }, []);
    const handleLogout = () => {
        setTableauToken('');
        localStorage.removeItem('jwtToken');
        setToken(''); 
        navigate('/');
    }

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>

            <h1>Welcome to Your Insights</h1>
            <TableauPulseEmbed/>

            <p>Explore analytics and insights with Tableau.</p>

            <label htmlFor="folderDropdown">Select a Persona:</label>
            <select
                id="folderDropdown"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                style={{ marginLeft: '10px' }}
            >
                <option value="">-- Select --</option>
                {folders.map((folder) => (
                    <option key={folder.id} value={folder.name}>
                        {folder.name} {/* Display the project name */}
                    </option>
                ))}
            </select>
            <button 
                onClick={() => {
                    if (tableauToken && selectedFolder) {
                        navigate(`/dashboardlandingpage?filter=${(selectedFolder)}`);
                    } else {
                        alert("Please select a project and ensure you're logged in.");
                    }
                }} 
                disabled={!selectedFolder} 
                style={{ marginLeft: '10px' }}>
                Go to Folder
            </button>

        </div>
    );
};

export default LandingPage;
