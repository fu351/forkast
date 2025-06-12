from fastapi import FastAPI, Request
import os
from supabase import create_client
from datetime import date, timedelta

app = FastAPI()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def health():
    return {"status": "ok"}

@app.get("/recipes")
def list_recipes():
    response = supabase.table("recipes").select("*").execute()
    return response.data

@app.get("/pantry/expiring")
def check_expiring_items():
    today = date.today()
    soon = today + timedelta(days=2)
    response = supabase.table("pantry_items").select("*").lte("expiry_date", soon.isoformat()).eq("consumed", False).execute()
    return response.data