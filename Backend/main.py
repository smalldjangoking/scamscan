from fastapi import FastAPI, status
from router import auth, profile, reports, scan, comments
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from dotenv import load_dotenv
import os
from services import Ip2whoisAPI
from contextlib import asynccontextmanager
import logging

load_dotenv()

API_IP2WHOIS_KEY = os.getenv("API_IP2WHOIS_KEY")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.api_ip2whois_client = Ip2whoisAPI(API_IP2WHOIS_KEY)
    yield
    await app.state.api_ip2whois_client.close()

app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/check", tags=["Health Check"], status_code=status.HTTP_200_OK)
def health_check():
    return {"status": "OK", "message": "ScamScan API is up and running."}


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(reports.router)
app.include_router(scan.router)
app.include_router(comments.router)