import React, { useEffect, useState, useRef } from 'react';
import { TableauViz, TableauEventType } from 'https://us-west-2b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
import './Dashboard.css'; // Import the stylesheet
import { useNavigate, useLocation } from 'react-router-dom';

// JWT decoding utility
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("[parseJwt] Could not decode JWT:", e);
        return {};
    }
}

function Dashboard({ token, setToken }) {
    const [error, setError] = useState(null);
    // const viz = "https://us-west-2b.online.tableau.com/t/eacloud/views/ExecutiveOverview/ProducerKPIs";
    //EmbedSEUBL viz
    const viz = "https://us-west-2b.online.tableau.com/t/eacloud/views/UAFSuperstore-AllisonTest/Overview"
    console.log("viz", viz)

    const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
    const vizRef = useRef(null);  // Reference for the dashboard viz
    const authoringVizRef = useRef(null);  // Reference for the authoring viz in modal
    const navigate = useNavigate();
    const location = useLocation();
    const [vizUrl, setVizUrl] = useState("");
    const [deviceType, setDeviceType] = useState(window.innerWidth < 700 ? 'phone' : 'desktop');

    function handleLoadError(e) {
        let message = "Unknown error";
        try {
            message = JSON.parse(e.detail.message);
        } catch {
            message = e.detail.message || "Unknown error";
        }
        console.log("Setting error:", JSON.stringify(message.errorCode) || message); // <--- Add this!
        setError(`Tableau failed to load: ${JSON.stringify(message.errorCode) || JSON.stringify(message)}`);
    }

    function ErrorModal({ message, onClose }) {
        return (
            <div className="modal error-modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Error</h2>
                    <div>{message}</div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (location.state?.url) {
            setVizUrl(location.state.url);
        }
    }, [location.state]);

    // Handle dynamic device type based on screen size
    useEffect(() => {
        // Log initial device type
        console.log(`Initial screen width: ${window.innerWidth}px, Device type: ${deviceType}`);
        
        const handleResize = () => {
            const newDeviceType = window.innerWidth < 700 ? 'phone' : 'desktop';
            setDeviceType(newDeviceType);
            console.log(`Screen resized - Width: ${window.innerWidth}px, Device type: ${newDeviceType}`);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [deviceType]);

    const jwtToken = localStorage.getItem('jwtToken');

    // DECODE THE JWT
    let decodedJwt = {};
    let fullDecodedJwt = "";    
    if (jwtToken) {
        decodedJwt = parseJwt(jwtToken);
        fullDecodedJwt = JSON.stringify(decodedJwt);
    } else {
        fullDecodedJwt = "";
    }

    // const vizUrl = "https://us-west-2b.online.tableau.com/t/eacloud/views/Test_Exelixis/InsuranceDashboard-PortfolioView";

    console.log("vizUrl: ", vizUrl);  // Log the viz URL
    console.log("jwtToken: ", jwtToken);  // Log the JWT token
    console.log("vizRef current: ", vizRef.current);  // Check if the vizRef is set
    console.log('Link to decode JWT: https://jwt.io/#debugger-io?token=' + jwtToken);

    // Log the FULL DECODED JWT to the console
    console.log("Decoded JWT object:", decodedJwt);
    console.log("Decoded JWT (stringified):", fullDecodedJwt);

    useEffect(() => {
        if (jwtToken && vizRef.current) {
            console.log("Initializing Tableau Viz...");
            const viz = vizRef.current;
            viz.token = jwtToken;

            // Add error event listener
            viz.addEventListener(TableauEventType.VizLoadError, handleLoadError);

            viz.addEventListener(TableauEventType.FirstInteractive, () => {
                console.log('Viz is interactive!');
            });
            viz.addEventListener(TableauEventType.MarkSelectionChanged, (markSelectionChangedEvent) => {
                markSelectionChangedEvent.detail.getMarksAsync().then((marks) => {
                    console.log("marksData", marks.data[0]);
                });
            });

            // Clean up event listener on unmount
            return () => {
                viz.removeEventListener(TableauEventType.VizLoadError, handleLoadError);
            };
        } else {
            console.log("JWT Token or Viz Ref not found. Check these values.");
        }
    }, [jwtToken, vizUrl]);

    useEffect(() => {
        if (location.state?.url) {
            setVizUrl(location.state.url);
        }
    }, [location.state]);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('jwtToken');
        navigate('/');
    };

    const openModal = () => {
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Close the modal
    };

    return (
        <div className="container">
            <h1>Tableau Sandbox</h1>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            <button className="btn btn-primary" onClick={openModal}>Edit</button>

            <div id="tableauVizContainer">
                <tableau-viz
                    id="tableauViz"
                    ref={vizRef}
                    // src={vizUrl}
                    //UBL demo
                    src={viz}
                    token={jwtToken}
                    // token='bad-token'
                    device={deviceType}
                    toolbar="hidden"
                    class="tableau-viz"
                >
                    <custom-parameter name=':dataDetails' value='no' />
                    {/* <viz-parameter name="jwt" value={fullDecodedJwt}></viz-parameter> */}
                    <viz-parameter name="iss" value={decodedJwt.iss} />
                    <viz-parameter name="exp" value={decodedJwt.exp} />
                    <viz-parameter name="sub" value={decodedJwt.sub} />

                
                </tableau-viz>
            </div>

            {error && (
                <ErrorModal message={error} onClose={() => setError(null)} />
            )}

            {/* Modal Component for editing, unchanged */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Edit Dashboard</h2>
                        <div id="tableauVizContainer" ref={vizRef}>
                            <tableau-authoring-viz
                                ref={vizRef}
                                id="tableauAuthoringViz"
                                src="https://us-west-2b.online.tableau.com/t/eacloud/views/ExecutiveOverview/ProducerKPIs"
                                token={jwtToken}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
