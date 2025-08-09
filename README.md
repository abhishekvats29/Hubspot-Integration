# VectorShift Integrations Technical Assessment

## Project Overview

This repository contains a full-stack application implementing the VectorShift Integrations Technical Assessment. The primary focus was on backend development using Python and FastAPI, building HubSpot OAuth integration and item loading logic. To complement this, a React frontend was also developed to demonstrate and test the integrations in a user-friendly interface.

---

## Live Demo

A live demo of the frontend is available here:  
[Live Demo Link](https://your-live-demo-link.com)  <!-- Replace with your actual live URL -->

---

## Screenshot

![Project Screenshot](./path/to/screenshot.png)  <!-- Replace with your actual screenshot path -->

---

## Tech Stack

- **Frontend:** React (JavaScript), Bootstrap  
- **Backend:** Python FastAPI  
- **Integrations:** HubSpot OAuth and API integration, Airtable and Notion (partially stubbed)  
- **Data Store:** Redis (required locally for backend)  

---

## Prerequisites

- Node.js (v14+) and npm  
- Python 3.9+ and pip  
- Redis installed and running (`redis-server`)  

---

## Setup Instructions

### Backend Setup

1. Open terminal, navigate to backend folder:

    ```bash
    cd backend
    ```

2. (Optional) Create and activate virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    venv\Scripts\activate     # Windows
    ```

3. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Start Redis server:

    ```bash
    redis-server
    ```

5. Run FastAPI server with auto-reload:

    ```bash
    uvicorn main:app --reload
    ```

---

### Frontend Setup

1. Open a new terminal, navigate to frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start React development server:

    ```bash
    npm run start
    ```

---

## Environment Variables

Set these environment variables in your backend environment for HubSpot OAuth:

- `HUBSPOT_CLIENT_ID`  
- `HUBSPOT_CLIENT_SECRET`

---

## API Endpoints

| Method | Endpoint                      | Description                           |
|--------|-------------------------------|-------------------------------------|
| GET    | `/authorize_hubspot`           | Starts HubSpot OAuth flow            |
| GET    | `/oauth2callback_hubspot`      | OAuth redirect URI callback handler |
| GET    | `/get_hubspot_credentials`     | Fetch stored HubSpot credentials    |
| GET    | `/get_items_hubspot`           | Fetch HubSpot integration items     |

*Other endpoints for Airtable and Notion integrations exist but are stubbed.*

---

## Features Implemented

- Full HubSpot OAuth flow backend implementation  
- HubSpot API integration to fetch items  
- Frontend HubSpot integration UI  
- Redis caching for tokens and credentials  

---

## Notes

- Airtable and Notion integrations remain incomplete due to missing credentials  
- Redis must be running locally before backend startup  
- `.gitignore` is excluded from repository (local only)  

---

## Author

**Abhishek Vats**  

---

## License

This project is licensed under the [MIT License](LICENSE).
---

Thank you for reviewing my submission!


