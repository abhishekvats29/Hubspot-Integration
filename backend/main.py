from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes import hubspot, airtable, notion

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to VectorShift Integration API"}

# Register routers
app.include_router(hubspot.router, prefix="/integrations/hubspot", tags=["HubSpot"])
app.include_router(airtable.router, prefix="/integrations/airtable", tags=["Airtable"])
app.include_router(notion.router, prefix="/integrations/notion", tags=["Notion"])


