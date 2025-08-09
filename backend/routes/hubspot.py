# src/routes/hubspot.py

import os
import uuid
import json
import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from typing import List
from models.integration_item import IntegrationItem
from services.redis_client import redis_client  # Redis client (async compatible)

router = APIRouter()

HUBSPOT_CLIENT_ID = os.getenv("HUBSPOT_CLIENT_ID")
HUBSPOT_CLIENT_SECRET = os.getenv("HUBSPOT_CLIENT_SECRET")
HUBSPOT_REDIRECT_URI = os.getenv("HUBSPOT_REDIRECT_URI")


async def get_items_hubspot(access_token: str) -> List[IntegrationItem]:
    """
    Fetch HubSpot contacts using the access token,
    map them into IntegrationItem objects, and return the list.
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    params = {
        "limit": 20,
        "properties": "firstname,lastname,email,phone,company,lifecycle_stage,jobtitle"
    }

    url = "https://api.hubapi.com/crm/v3/objects/contacts"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)

    if response.status_code != 200:
        raise Exception(f"HubSpot API error: {response.status_code} - {response.text}")

    data = response.json()
    contacts = data.get("results", [])

    items = []
    for contact in contacts:
        props = contact.get("properties", {})
        name = f"{props.get('firstname', '')} {props.get('lastname', '')}".strip()

        metadata = {
            "email": props.get("email", ""),
            "phone": props.get("phone", ""),
            "company": props.get("company", ""),
            "lifecycle_stage": props.get("lifecycle_stage", ""),
            "jobtitle": props.get("jobtitle", ""),
            "createdAt": contact.get("createdAt"),
            "updatedAt": contact.get("updatedAt")
        }

        item = IntegrationItem(
            id=contact.get("id"),
            name=name or "No Name",
            type="Contact",
            parent_id=None,
            parent_path_or_name=None,
            metadata=metadata
        )
        items.append(item)

    return items


@router.get("/authorize")
async def authorize_hubspot():
    state = str(uuid.uuid4())
    scope = "crm.objects.contacts.read oauth"

    url = (
        "https://app.hubspot.com/oauth/authorize"
        f"?client_id={HUBSPOT_CLIENT_ID}"
        f"&redirect_uri={HUBSPOT_REDIRECT_URI}"
        f"&scope={scope}"
        f"&state={state}"
    )
    return RedirectResponse(url)


@router.get("/oauth2callback")
async def oauth2callback_hubspot(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided")

    token_url = "https://api.hubapi.com/oauth/v1/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "authorization_code",
        "client_id": HUBSPOT_CLIENT_ID,
        "client_secret": HUBSPOT_CLIENT_SECRET,
        "redirect_uri": HUBSPOT_REDIRECT_URI,
        "code": code,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get access token")

    token_data = response.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    if not access_token:
        raise HTTPException(status_code=500, detail="Access token not found in response")

    # Fetch user info
    user_info_url = "https://api.hubapi.com/integrations/v1/me"
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        user_response = await client.get(user_info_url, headers=headers)

    if user_response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get user info")

    user_data = user_response.json()
    print("HubSpot User Data:", user_data)  # Debug log

    user_id = user_data.get("portalId")
    if not user_id:
        print("Full user data for debug:", user_data)
        raise HTTPException(status_code=400, detail="User ID (portalId) not found in HubSpot response")

    integration_item = IntegrationItem(
        id=user_id,
        type="hubspot",
        access_token=access_token,
        metadata={
            "scope": "contacts",
            "refresh_token": refresh_token
        }
    )

    redis_key = f"integration:{user_id}:hubspot"
    await redis_client.set(redis_key, json.dumps(integration_item.__dict__))

    return RedirectResponse(
    f"http://localhost:3000/hubspot-oauth-success?success=true&integration_id={user_id}"
)


@router.get("/credentials/{user_id}")
async def get_hubspot_credentials(user_id: str):
    redis_key = f"integration:{user_id}:hubspot"
    integration_data = await redis_client.get(redis_key)

    if not integration_data:
        raise HTTPException(status_code=404, detail="No credentials found for this user")

    if isinstance(integration_data, bytes):
        integration_data = integration_data.decode("utf-8")

    try:
        credentials = json.loads(integration_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid credential format in Redis")

    return credentials


@router.get("/items/{user_id}")
async def get_items_hubspot_route(user_id: str):
    redis_key = f"integration:{user_id}:hubspot"
    integration_data = await redis_client.get(redis_key)

    if not integration_data:
        raise HTTPException(status_code=404, detail="No credentials found for this user")

    if isinstance(integration_data, bytes):
        integration_data = integration_data.decode("utf-8")

    try:
        credentials = json.loads(integration_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid credential format in Redis")

    access_token = credentials.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Access token missing")

    try:
        items = await get_items_hubspot(access_token)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return items
