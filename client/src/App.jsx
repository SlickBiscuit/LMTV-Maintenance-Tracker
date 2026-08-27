import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [lmtvs, setLmtvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLmtv, setSelectedLmtv] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/lmtvs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch LMTVs");
        }

        return response.json();
      })
      .then((data) => {
        setLmtvs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <p className="loading">Loading LMTVs...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  const handleLmtvClick = (id) => {
    fetch(`http://localhost:3000/api/lmtvs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch LMTV");
        }

        return response.json();
      })
      .then((data) => {
        setSelectedLmtv(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://localhost:3000/api/lmtvs/${id}/mechanics`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch mechanics");
        }

        return response.json();
      })
      .then((data) => {
        setMechanics(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(`http://localhost:3000/api/lmtvs/${id}/maintenance`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch maintenance records");
        }

        return response.json();
      })
      .then((data) => {
        setMaintenanceRecords(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getStatusClass = (status) => {
    if (status === "Operational") {
      return "status-operational";
    }

    if (status === "Maintenance in progress") {
      return "status-maintenance-in-progress";
    }

    if (status === "Deadlined") {
      return "status-deadlined";
    }

    return "";
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1>LMTV Maintenance Tracker</h1>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total LMTVs</h3>
          <p>{lmtvs.length}</p>
        </div>

        <div className="summary-card">
          <h3>Operational</h3>
          <p>
            {lmtvs.filter((lmtv) => lmtv.status === "Operational").length}
          </p>
        </div>

        <div className="summary-card">
          <h3>Maintenance In Progress</h3>
          <p>
            {lmtvs.filter((lmtv) => lmtv.status === "Maintenance in progress").length}
          </p>
        </div>

        <div className="summary-card">
          <h3>Deadlined</h3>
          <p>
            {lmtvs.filter((lmtv) => lmtv.status === "Deadlined").length}
          </p>
        </div>
      </div>

      <h2>LMTVs</h2>

      {selectedLmtv && (
        <div className="lmtv-details">
          <button
            onClick={() => {
              setSelectedLmtv(null);
              setMechanics([]);
              setMaintenanceRecords([]);
            }}
          >
            Back to LMTVs
          </button>

          <h2>LMTV Details</h2>

          <div className="lmtv-info">
            <p>
              <strong>ID:</strong> {selectedLmtv.id}
            </p>

            <p>
              <strong>Unit ID:</strong> {selectedLmtv.unit_id}
            </p>

            <p>
              <strong>Plate:</strong> {selectedLmtv.plate_number}
            </p>

            <p>
              <strong>Serial:</strong> {selectedLmtv.serial_number}
            </p>

            <p>
              <strong>Mileage:</strong> {selectedLmtv.mileage}
            </p>

            <p>
              <strong>Status:</strong> {selectedLmtv.status}
            </p>
          </div>

          <h3>Mechanics</h3>

          {mechanics.length === 0 ? (
            <p>No mechanics assigned.</p>
          ) : (
            <ol>
              {mechanics.map((mechanic) => (
                <li key={mechanic.id}>
                  {mechanic.rank} {mechanic.first_name}{" "}
                  {mechanic.last_name}
                </li>
              ))}
            </ol>
          )}


          <h3>Maintenance History</h3>

          {maintenanceRecords.length === 0 ? (
            <p>No maintenance records.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Mileage</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {maintenanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.maintenance_type}</td>
                    <td>{record.description}</td>
                    <td>{record.mileage}</td>
                    <td>{formatDateTime(record.date_completed)}</td>
                    <td className={getStatusClass(record.status)}>
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!selectedLmtv && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Unit ID</th>
              <th>Plate Number</th>
              <th>Serial Number</th>
              <th>Mileage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {lmtvs.map((lmtv) => (
              <tr
                key={lmtv.id}
                onClick={() => handleLmtvClick(lmtv.id)}
              >
                <td>{lmtv.id}</td>
                <td>{lmtv.unit_id}</td>
                <td>{lmtv.plate_number}</td>
                <td>{lmtv.serial_number}</td>
                <td>{lmtv.mileage}</td>
                <td className={getStatusClass(lmtv.status)}>
                  {lmtv.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;