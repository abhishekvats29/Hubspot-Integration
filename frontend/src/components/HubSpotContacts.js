import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { PeopleFill } from "react-bootstrap-icons";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HubSpotContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const query = useQuery();
  const integrationId = query.get("integration_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContactsAndUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const contactsRes = await fetch(
          `http://localhost:8000/integrations/hubspot/items/${integrationId}`
        );
        if (!contactsRes.ok) {
          throw new Error(`Failed to fetch contacts: ${contactsRes.statusText}`);
        }
        const contactsData = await contactsRes.json();
        setContacts(contactsData);

        const userRes = await fetch(
          `http://localhost:8000/integrations/hubspot/credentials/${integrationId}`
        );
        if (!userRes.ok) {
          throw new Error(`Failed to fetch user info: ${userRes.statusText}`);
        }
        const userData = await userRes.json();
        setUserInfo(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (integrationId) {
      fetchContactsAndUser();
    } else {
      setError("No integration ID provided.");
    }
  }, [integrationId]);

  const renderWithTooltip = (value, label) => {
    if (!value || value === "N/A" || value === "No Name" || value === "No email") {
      return (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`tooltip-${label}`}>No {label.toLowerCase()} available</Tooltip>}
        >
          <span className="text-muted fst-italic">N/A</span>
        </OverlayTrigger>
      );
    }
    return value;
  };

  return (
    <Container className="my-4">
      <div className="d-flex flex-column align-items-center justify-content-center mb-4 gap-3">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <PeopleFill size={28} className="text-primary" />
          <h2 className="mb-0">HubSpot Contacts</h2>
        </div>

        <Button
          variant="outline-primary"
          onClick={() => navigate("/integration-form")}
          style={{ fontWeight: "600" }}
        >
          ← Back to Integration Form
        </Button>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3 text-muted">Loading contacts and user info...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {userInfo && !loading && !error && (
        <Card className="mb-4 shadow-sm" style={{ borderRadius: "0.5rem" }}>
          <Card.Body>
            <Card.Title>User / Portal Info</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Integration ID:</strong> {integrationId}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Scope:</strong> {renderWithTooltip(userInfo.scope, "Scope")}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && contacts.length === 0 && (
        <Alert variant="info" className="text-center">
          No contacts found.
        </Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {contacts.map((contact) => (
          <Col key={contact.id}>
            <Card
              className="h-100 shadow-sm"
              style={{ borderRadius: "0.5rem", transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Card.Body>
                <Card.Title>{renderWithTooltip(contact.name, "Name")}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {renderWithTooltip(contact.metadata?.email, "Email")} <br />
                  <strong>Phone:</strong> {renderWithTooltip(contact.metadata?.phone, "Phone")} <br />
                  <strong>Company:</strong> {renderWithTooltip(contact.metadata?.company, "Company")} <br />
                  <strong>Job Title:</strong> {renderWithTooltip(contact.metadata?.jobtitle, "Job Title")}
                </Card.Text>
              </Card.Body>
              <Card.Footer
                className="text-muted text-end"
                style={{ fontSize: "0.8rem" }}
              >
                Created:{" "}
                {contact.metadata?.createdAt
                  ? new Date(contact.metadata.createdAt).toLocaleDateString()
                  : "N/A"}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HubSpotContacts;
