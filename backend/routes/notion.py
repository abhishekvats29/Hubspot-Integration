# routes/notion.py

from fastapi import APIRouter, Form, Request
from integrations.notion import (
    authorize_notion,
    get_items_notion,
    oauth2callback_notion,
    get_notion_credentials
)

router = APIRouter()

@router.post("/authorize")
async def authorize(user_id: str = Form(...), org_id: str = Form(...)):
    return await authorize_notion(user_id, org_id)

@router.get("/oauth2callback")
async def oauth2callback(request: Request):
    return await oauth2callback_notion(request)

@router.post("/credentials")
async def get_credentials(user_id: str = Form(...), org_id: str = Form(...)):
    return await get_notion_credentials(user_id, org_id)

@router.post("/load")
async def get_items(credentials: str = Form(...)):
    return await get_items_notion(credentials)
