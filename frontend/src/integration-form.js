import React, { useState } from "react";
import { AirtableIntegration } from "./integrations/airtable";
import { NotionIntegration } from "./integrations/notion";
import { HubspotIntegration } from "./integrations/hubspot";
import { DataForm } from "./data-form";

const integrationMapping = {
  Notion: NotionIntegration,
  Airtable: AirtableIntegration,
  HubSpot: HubspotIntegration,
};

export const IntegrationForm = () => {
  const [integrationParams, setIntegrationParams] = useState({});
  const [user, setUser] = useState("TestUser");
  const [org, setOrg] = useState("TestOrg");
  const [currType, setCurrType] = useState(null);

  const CurrIntegration = integrationMapping[currType];

  return (
    <div
      className="container py-5"
      style={{
        background: "#f5f5f5",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div
            className="p-5 rounded-4 mb-4"
            style={{
              background: "rgba(0, 58, 140, 0.85)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.37), inset 0 0 20px rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
            }}
          >
            <h2 className="mb-4 fw-bold text-center">Integration Setup</h2>

            {/* User */}
            <div className="mb-4">
              <label htmlFor="userInput" className="form-label fw-semibold">
                User
              </label>
              <input
                type="text"
                id="userInput"
                className="form-control"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter user"
                style={{
                  backgroundColor: "white",
                  borderColor: "#0d2a5e",
                  color: "#0d2a5e",
                }}
              />
            </div>

            {/* Organization */}
            <div className="mb-4">
              <label htmlFor="orgInput" className="form-label fw-semibold">
                Organization
              </label>
              <input
                type="text"
                id="orgInput"
                className="form-control"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Enter organization"
                style={{
                  backgroundColor: "white",
                  borderColor: "#0d2a5e",
                  color: "#0d2a5e",
                }}
              />
            </div>

            {/* Integration Select */}
            <div className="mb-5">
              <label
                htmlFor="integrationSelect"
                className="form-label fw-semibold"
              >
                Integration Type
              </label>
              <select
                id="integrationSelect"
                className="form-select"
                value={currType || ""}
                onChange={(e) => setCurrType(e.target.value || null)}
                style={{
                  backgroundColor: "white",
                  borderColor: "#0d2a5e",
                  color: "#0d2a5e",
                }}
              >
                <option value="">Select Integration</option>
                {Object.keys(integrationMapping).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Integration Component */}
            {CurrIntegration && (
              <div className="mb-4">
                <CurrIntegration
                  user={user}
                  org={org}
                  integrationParams={integrationParams}
                  setIntegrationParams={setIntegrationParams}
                  connectButtonStyle={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Form in Matching Glass Blue Card */}
      {integrationParams?.credentials && (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <div
              className="p-4 rounded-4"
              style={{
                background: "rgba(0, 58, 140, 0.85)", // Match IntegrationForm
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.37), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
            >
              <DataForm
                integrationType={integrationParams?.type}
                credentials={integrationParams?.credentials}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
