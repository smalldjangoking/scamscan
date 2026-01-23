from fastapi import FastAPI, status
from router import auth, profile, reports, scan, comments, ceo
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
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"], status_code=status.HTTP_200_OK)
async def root():
    return {
        "status": "ok",
        "name": "ScamScan API",
        "version": "1.0.0",
        "docs": "/docs",
        "message": "Welcome to ScamScan API. Full documentation available at /docs."
    }

@app.get("/v1/check", tags=["Health Check"], status_code=status.HTTP_200_OK, include_in_schema=False)
def health_check():
    return {"status": "OK", "message": "ScamScan API is up and running."}


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(reports.router)
app.include_router(scan.router)
app.include_router(comments.router)
app.include_router(ceo.router)
