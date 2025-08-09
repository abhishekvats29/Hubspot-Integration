import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { IntegrationForm } from "./integration-form";  // named import
import HubSpotOAuthSuccess from "./components/HubSpotOAuthSuccess";
import HubSpotContacts from "./components/HubSpotContacts";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root path renders IntegrationForm */}
        <Route path="/" element={<IntegrationForm />} />

        <Route path="/integration-form" element={<IntegrationForm />} />
        <Route path="/hubspot-oauth-success" element={<HubSpotOAuthSuccess />} />
        <Route path="/hubspot-contacts" element={<HubSpotContacts />} />

        {/* Redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
