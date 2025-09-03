import React, { useEffect, useRef } from 'react';

// Import the Tableau embedding API directly
// This line assumes the script is accessible from your web application.
import { TableauViz } from 'https://us-west-2b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

function DashboardWithWritebackExtension() {
    const vizRef = useRef(null); // Ref to attach to the <tableau-viz> element

    // Hardcode your Tableau dashboard URL directly here
    const tableauDashboardUrl = "https://us-west-2b.online.tableau.com/t/eacloud/views/apartment-requests-data/MaintenanceRequestPortal";
    const jwtToken = localStorage.getItem('jwtToken');


    useEffect(() => {
        if (vizRef.current) {
            console.log("Tableau Viz component mounted and referenced.");
        }
    }, []);

    return (
        <div className="dashboard-container">
            <h1>My Embedded Tableau Dashboard</h1>
            <div id="tableauVizWrapper">
                <tableau-viz
                    ref={vizRef}
                    src={tableauDashboardUrl}
                    token={jwtToken}
                    device="desktop" // Adjust to "phone" or "tablet" if needed
                    toolbar="hidden" // Set to "bottom" or "top" to show the toolbar
                    hide-tabs // Set to "false" if you want to show tabs
                    // Add other properties as needed, e.g., filters: '[{"FieldName":"Value"}]'
                >
                </tableau-viz>
            </div>
        </div>
    );
}

export default DashboardWithWritebackExtension;