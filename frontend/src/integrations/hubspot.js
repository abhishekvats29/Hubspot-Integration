import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";

export const HubspotIntegration = ({
  user,
  integrationParams,
  setIntegrationParams,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle Connect button click - open backend authorize endpoint in popup
  const handleConnectClick = () => {
    setIsConnecting(true);

    // Open popup directly to your backend authorize endpoint
    const newWindow = window.open(
      "http://127.0.0.1:8000/integrations/hubspot/authorize",
      "HubSpot Authorization",
      "width=600,height=600"
    );

    if (!newWindow) {
      alert("Popup blocked by browser. Please allow popups and try again.");
      setIsConnecting(false);
      return;
    }

    // Poll popup every 500ms to detect when it closes
    const pollTimer = window.setInterval(() => {
      if (newWindow.closed) {
        window.clearInterval(pollTimer);
        handleWindowClosed();
      }
    }, 500);
  };

  // After popup closes, fetch credentials from backend
  const handleWindowClosed = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/integrations/hubspot/credentials/${user}`
      );
      const credentials = response.data;

      if (credentials) {
        setIsConnected(true);
        setIntegrationParams((prev) => ({
          ...prev,
          credentials,
          type: "Hubspot",
        }));
        alert("Authorization successful!");
      } else {
        alert("No credentials found after authorization.");
      }
    } catch (e) {
      alert(
        e?.response?.data?.detail ||
          e.message ||
          "Failed to fetch credentials after authorization."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // On mount or integrationParams change, update connection state
  useEffect(() => {
    setIsConnected(!!integrationParams?.credentials);
  }, [integrationParams]);

  return (
    <Box sx={{ mt: 2 }}>
      Parameters
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={isConnected ? undefined : handleConnectClick}
          color={isConnected ? "success" : "primary"}
          disabled={isConnecting}
          sx={{
            pointerEvents: isConnected ? "none" : "auto",
            cursor: isConnected ? "default" : "pointer",
            opacity: isConnected ? 1 : undefined,
            backgroundColor: isConnected
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "#fff",
            fontWeight: 500,
            padding: "8px 18px",
            borderRadius: "10px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          {isConnected ? (
            "HubSpot Connected"
          ) : isConnecting ? (
            <CircularProgress size={20} />
          ) : (
            "Connect to HubSpot"
          )}
        </Button>
      </Box>
    </Box>
  );
};
