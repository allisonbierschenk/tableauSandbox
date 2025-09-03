import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

const TableauPulseEmbed = () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const pulseRefs = useRef([]);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [metrics, setMetrics] = useState([]);


    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            const decoded = jwtDecode(jwtToken);
            console.log("decoded", decoded)

            const username = decoded.sub 
            console.log("Logged in user:", username);
    
            const userMetricsMap = {
                "mario@insurance.com": [
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/5b334b1b-eaad-4bca-8073-2f74f7d946d2",
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/0be4043b-1bb3-4442-9554-4dba5e6cf9f3"
                ],
                "mackenzie@insurance.com": [
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/285af7c0-e68b-4b94-a66e-f8089b0ed85e",
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/17b4c989-3e99-48f0-b1e3-413c4b6ff35a",
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/0be4043b-1bb3-4442-9554-4dba5e6cf9f3"
                ],
                "default": [
                    "https://us-west-2b.online.tableau.com/pulse/site/eacloud/metrics/5b334b1b-eaad-4bca-8073-2f74f7d946d2"
                ]
            };
    
            setMetrics(userMetricsMap[username] || userMetricsMap["default"]);
        }
    }, []);

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "50vh", 
            textAlign: "center"
        }}>
            <h2>Tableau Pulse Metrics</h2>
            <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                justifyContent: "center", 
                gap: "20px",
                maxWidth: "1200px"
            }}>
                {metrics.map((src, index) => (
                    <div key={src} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <tableau-pulse
                            ref={el => pulseRefs.current[index] = el}
                            token={jwtToken}
                            id={`tableauPulse-${index}`}
                            src={src}
                            height="420"
                            width="350"
                            layout="card"
                        ></tableau-pulse>
                        <button 
                            onClick={() => setSelectedMetric(src)}
                            style={{
                                marginTop: "10px",
                                padding: "8px 16px",
                                fontSize: "16px",
                                cursor: "pointer",
                                borderRadius: "5px",
                                border: "none",
                                backgroundColor: "#0073e6",
                                color: "white"
                            }}
                        >
                            View Full Metric
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedMetric && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        textAlign: "center",
                        position: "relative",
                        width: "90%",
                        maxWidth: "800px"
                    }}>
                        <button 
                            onClick={() => setSelectedMetric(null)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "transparent",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer"
                            }}
                        >
                            ✖
                        </button>
                        <h3>Full Metric View</h3>
                        <tableau-pulse
                            token={jwtToken}
                            src={`${selectedMetric}?layout=default`}
                            height="500"
                            width="100%"
                            layout="default"
                        ></tableau-pulse>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableauPulseEmbed;
