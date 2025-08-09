import os
import uuid
import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from models.integration_item import IntegrationItem
from services.redis_client import redis_client

router = APIRouter()

HUBSPOT_CLIENT_ID = os.getenv("HUBSPOT_CLIENT_ID")
HUBSPOT_CLIENT_SECRET = os.getenv("HUBSPOT_CLIENT_SECRET")
HUBSPOT_REDIRECT_URI = os.getenv("HUBSPOT_REDIRECT_URI", "http://localhost:8000/integrations/hubspot/oauth2callback")
HUBSPOT_AUTH_URL = "https://app.hubspot.com/oauth/authorize"
HUBSPOT_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token"

SCOPES = [
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "crm.schemas.contacts.read",
    "crm.schemas.contacts.write"
]

@router.get("/integrations/hubspot/authorize")
async def authorize():
    state = str(uuid.uuid4())
    scope_str = " ".join(SCOPES)

    params = {
        "client_id": HUBSPOT_CLIENT_ID,
        "redirect_uri": HUBSPOT_REDIRECT_URI,
        "scope": scope_str,
        "state": state
    }

    query_string = "&".join([f"{key}={value}" for key, value in params.items()])
    url = f"{HUBSPOT_AUTH_URL}?{query_string}"
    return RedirectResponse(url)

@router.get("/integrations/hubspot/oauth2callback")
async def oauth2callback(code: str, state: str):
    try:
        async with httpx.AsyncClient() as client:
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            data = {
                "grant_type": "authorization_code",
                "client_id": HUBSPOT_CLIENT_ID,
                "client_secret": HUBSPOT_CLIENT_SECRET,
                "redirect_uri": HUBSPOT_REDIRECT_URI,
                "code": code
            }
            response = await client.post(HUBSPOT_TOKEN_URL, data=data, headers=headers)
            response.raise_for_status()
            token_data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Token exchange failed: {str(e)}")

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    expires_in = token_data.get("expires_in")

    if not access_token or not refresh_token:
        raise HTTPException(status_code=400, detail="Access or refresh token missing in response")

    # Simulated user_id for example; in production get it from session/auth
    user_id = "user-1234"

    integration_item = IntegrationItem(
        id=user_id,
        type="hubspot",
        access_token=access_token,
        metadata={
            "scope": "contacts",
            "refresh_token": refresh_token,
            "expires_in": expires_in
        }
    )

    await redis_client.set(f"integration:{user_id}:hubspot", integration_item.json())
    return {"message": "HubSpot integration successful", "access_token": access_token}
