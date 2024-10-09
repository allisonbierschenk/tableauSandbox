import React, { useEffect, useState, useRef } from 'react';
import { TableauViz, SheetType, TableauEventType } from 'https://us-west-2b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
// import { TableauViz, SheetType, TableauEventType } from 'https://prod-useast-b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
import './Dashboard.css'; 
import { useNavigate } from 'react-router-dom';

function Dashboard({ token, setToken }) {
    const [error, setError] = useState(null);
    const [viz] = useState("https://us-west-2b.online.tableau.com/t/eacloud/views/UAFSuperstore-AllisonTest/Customers");
    const [DoeNJViz] = useState("https://prod-useast-b.online.tableau.com/t/njdoepublic/views/StateRankingReport_Test/Main")
    const vizRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && vizRef.current) {
            const viz = vizRef.current;
            viz.token = token;
            viz.addFilter("YEAR(Order Date)", 2019);

            const waitForVizInteractive = new Promise((resolve) => {
                viz.addEventListener(TableauEventType.FirstInteractive, () => {
                    console.log('Viz is interactive!');
                    resolve(viz);
                });
            });

            waitForVizInteractive.then((viz) => {
                if (viz.workbook.activeSheet.sheetType === SheetType.Dashboard) {
                    const dashboard = viz.workbook.activeSheet;
                    const worksheets = dashboard.worksheets.filter((ws) => ws.name === 'CustomerOverview');
                    worksheets.forEach((ws) => ws.clearFilterAsync("YEAR(Order Date)"));
                }
            });
        }
    }, [token]);

    const handleLogout = () => {
        // Clear the token
        setToken('');
        // Redirect to the login page
        navigate('/');
    };

    return (
        <div className="container">
            <h1>Tableau Sandbox</h1>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            {error ? (
                <div>{error}</div>
            ) : token ? (
                <tableau-viz
                    ref={vizRef}
                    token={token}
                    id="tableauViz"
                    src={DoeNJViz}
                    device="desktop"
                    toolbar="hidden"
                    className="tableau-viz"
                />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Dashboard;
