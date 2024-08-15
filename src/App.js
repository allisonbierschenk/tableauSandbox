import React, { useEffect, useState, useRef } from 'react';
import {TableauViz,SheetType,TableauEventType,FilterUpdateType} from 'https://us-west-2b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
import './App.css'; // Import the stylesheet

function App() {
    const [token, setToken] = useState('');
    const [error, setError] = useState(null);
    const [viz] = useState("https://us-west-2b.online.tableau.com/t/eacloud/views/UAFSuperstore-AllisonTest/Customers");
    const vizRef = useRef(null)
  
    async function authenticate() {
        try {
            const response = await fetch('http://localhost:3333/tableau-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: process.env.USERNAME,
                    password: process.env.PASSWORD
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const jwtToken = data.jwtToken;

            // Store the JWT token in state
            setToken(jwtToken);

            console.log('JWT Token:', jwtToken);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to authenticate');
        }
    }

    useEffect(() => {
        authenticate();
    }, []);



    useEffect(() => {
      if (token && vizRef.current) {
        const viz = vizRef.current;
        viz.token = token;
        viz.addFilter("YEAR(Order Date)", 2019);

        // Create a promise for the viz becoming interactive
        const waitForVizInteractive = new Promise((resolve) => {
          viz.addEventListener(TableauEventType.FirstInteractive, () => {
            console.log('Viz is interactive!');
            resolve(viz);
          });
        });
  
        waitForVizInteractive
          .then((viz) => {
            let worksheets;
            if (viz.workbook.activeSheet.sheetType === SheetType.Dashboard) {
              const dashboard = viz.workbook.activeSheet;
              worksheets = dashboard.worksheets.filter((ws) => ws.name === 'CustomerOverview');
              worksheets.forEach(ws => ws.clearFilterAsync("YEAR(Order Date)"))

            }
          })
      }
    }, [token]);



    return (
        <div className="container">
            <h1>Tableau Sandbox</h1>
            {error ? (
                <div>{error}</div>
            ) : token ? (
              <tableau-viz
              ref={vizRef}
              token={token}
              id="tableauViz"
              src={viz}
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

export default App;
