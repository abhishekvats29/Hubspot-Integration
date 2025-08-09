# routes/airtable.py

from fastapi import APIRouter, Form, Request
from integrations.airtable import (
    authorize_airtable,
    get_items_airtable,
    oauth2callback_airtable,
    get_airtable_credentials
)

router = APIRouter()

@router.post("/authorize")
async def authorize(user_id: str = Form(...), org_id: str = Form(...)):
    return await authorize_airtable(user_id, org_id)

@router.get("/oauth2callback")
async def oauth2callback(request: Request):
    return await oauth2callback_airtable(request)

@router.post("/credentials")
async def get_credentials(user_id: str = Form(...), org_id: str = Form(...)):
    return await get_airtable_credentials(user_id, org_id)

@router.post("/load")
async def get_items(credentials: str = Form(...)):
    return await get_items_airtable(credentials)
