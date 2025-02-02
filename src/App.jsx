import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/contacts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key":
              "demo-api-key",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched Systeme.io communities:", data);
      } catch (error) {
        console.error("Error fetching Systeme.io data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        flexDirection: "column",
      }}
    >
      <p>Hello World!</p>
      <h2>Systeme.io Communities API Example</h2>
    </div>
  );
}

export default App;
