import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DataForm = ({ integrationType, credentials }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoad = async () => {
    if (!integrationType) {
      setError("Integration type is not selected");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("credentials", JSON.stringify(credentials || {}));
      const endpoint = integrationType.toLowerCase();
      const response = await axios.post(
        `http://localhost:8000/integrations/${endpoint}/load`,
        formData
      );

      // Get integration ID and navigate to contacts page
      const integrationId =
        response?.data?.integration_id || credentials?.integration_id;
      if (integrationId) {
        navigate(`/hubspot-contacts?integration_id=${integrationId}`);
      } else {
        setError("Integration ID not found in response.");
      }
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectOpen = () => {
    const fixedIntegrationId = "243547264";
    window.open(
      `http://localhost:3000/hubspot-contacts?integration_id=${fixedIntegrationId}`,
      "_blank"
    );
  };

  const handleClear = () => {
    setError("");
  };

  return (
    <div className="container my-4 p-4 bg-white rounded shadow-sm border border-primary text-primary" style={{ maxWidth: 600 }}>
      <h2 className="fw-bold text-center mb-4" style={{ color: "#003a8c" }}>
        Data Form
      </h2>

      <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-3">
        {/* Load Data Button (API call) */}
        <button
          type="button"
          className="btn btn-success flex-grow-1 flex-sm-grow-0"
          style={{ minWidth: "160px", borderRadius: "12px", fontWeight: 600 }}
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
                style={{ verticalAlign: "text-bottom" }}
              ></span>
              Loading...
            </>
          ) : (
            "Load Data"
          )}
        </button>

        {/* Direct Open Button (blue) */}
        <button
          type="button"
          className="btn btn-primary flex-grow-1 flex-sm-grow-0"
          style={{ minWidth: "160px", borderRadius: "12px", fontWeight: 600, fontSize: "0.85rem" }}
          onClick={handleDirectOpen}
        >
          Load Data
        </button>

        {/* Clear Data Button */}
        <button
          type="button"
          className="btn btn-danger flex-grow-1 flex-sm-grow-0"
          style={{ minWidth: "160px", borderRadius: "12px", fontWeight: 600 }}
          onClick={handleClear}
          disabled={loading}
        >
          Clear Data
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="alert alert-danger text-center py-2 mb-0"
          role="alert"
          style={{ fontSize: "1rem" }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
