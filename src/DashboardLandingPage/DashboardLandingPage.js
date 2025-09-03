import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLandingPage = () => {
    const [workbooks, setWorkbooks] = useState([]);
    const [images, setImages] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchWorkbooks() {
            const tableauToken = localStorage.getItem('tableauToken');
            if (!tableauToken) {
                console.log("No token found in localStorage");
                return;
            }

            const params = new URLSearchParams(location.search);
            const selectedFolder = params.get('filter'); // Get folder from URL
            console.log("selectedFolder", selectedFolder);

            try {
                const response = await fetch(`${process.env.REACT_APP_AUTH_SERVER}/tableau-views?filter=${encodeURIComponent(selectedFolder)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': tableauToken,  
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch workbooks');
                }

                const data = await response.json();
                console.log("Received data.views:", data.views);
                console.log("Received data.images:", data.images);

                setWorkbooks(data.views);

                // Convert images array into an object for quick lookup
                const imageMap = data.images.reduce((acc, img) => {
                    acc[img.viewId] = img.previewImage; // { viewId: previewImage }
                    return acc;
                }, {});

                setImages(imageMap);
            } catch (error) {
                console.error('Error fetching workbooks:', error);
            }
        }

        fetchWorkbooks();
    }, [location.search]);

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Dashboard Landing Page</h1>
            <div>
                {workbooks.length > 0 ? (
                    <div style={{
                        display: "flex", 
                        flexWrap: "wrap", 
                        justifyContent: "center", 
                        gap: "20px",
                        marginTop: "20px"
                    }}>
                        {workbooks.map((workbook) => (
                            <div key={workbook.id} style={{ textAlign: "center" }}>
                                <button
                                    onClick={() => {
                                        let decodedUrl = decodeURIComponent(workbook.contentUrl);
                                        decodedUrl = decodedUrl.replace('sheets/', '');
                                        console.log("decodedUrl", decodedUrl);

                                        navigate('/dashboard', {
                                            state: {
                                                url: `${process.env.REACT_APP_SERVER}/t/${process.env.REACT_APP_SITENAME}/views/${decodedUrl}`
                                            }
                                        });
                                    }}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'blue', 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Show Image if Available */}
                                    {images[workbook.id] ? (
                                        <img 
                                            src={images[workbook.id]} 
                                            alt={workbook.name} 
                                            style={{ 
                                                width: "320px", 
                                                height: "270px", 
                                                objectFit: "cover", 
                                                borderRadius: "5px" 
                                            }} 
                                        />
                                    ) : (
                                        <span>No Image</span> // Fallback if no image
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Loading....</p>
                )}
            </div>
        </div>
    );
};

export default DashboardLandingPage;
