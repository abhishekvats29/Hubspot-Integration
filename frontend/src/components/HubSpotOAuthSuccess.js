import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HubSpotOAuthSuccess = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const integrationId = query.get("integration_id");

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <Card className="p-4 shadow-sm" style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 48, textAlign: "center", color: "#28a745" }}>
          ✅
        </div>
        <h3 className="mb-3 text-center text-success">
          HubSpot Connected Successfully!
        </h3>
        <p className="text-center">
          Your Integration ID is:{" "}
          <strong style={{ color: "#001f4d" }}>
            {integrationId || "N/A"}
          </strong>
        </p>

        <div className="d-grid gap-3 mt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (integrationId) {
                navigate(`/hubspot-contacts?integration_id=${integrationId}`);
              } else {
                alert("Integration ID not found.");
              }
            }}
          >
            View Contacts
          </Button>

          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => navigate("/integration-form")}
          >
            Back to Integration Form
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default HubSpotOAuthSuccess;
