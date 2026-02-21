from fastapi import FastAPI, status
from fastapi.responses import Response
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
from database.admin import setup_admin
from database.database_settings import engine, SessionDep
from database.models import Reports
from sqlalchemy import select

load_dotenv()

API_IP2WHOIS_KEY = os.getenv("API_IP2WHOIS_KEY")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.api_ip2whois_client = Ip2whoisAPI(API_IP2WHOIS_KEY)
    yield
    await app.state.api_ip2whois_client.close()


app = FastAPI(lifespan=lifespan)

#Admin panel
setup_admin(app, engine)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://scamscan.io",
        "https://www.scamscan.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"], status_code=status.HTTP_200_OK)
async def root():
    return {
        "status": "ok",
        "name": "ScamScan API",
        "version": "1.1.1",
        "docs": "/docs",
        "message": "Welcome to ScamScan API. Full documentation available at /docs.",
    }


@app.get(
    "/v1/check",
    tags=["Health Check"],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def health_check():
    return {"status": "ok", "message": "ScamScan API is up and running."}


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(reports.router)
app.include_router(scan.router)
app.include_router(comments.router)
app.include_router(ceo.router)


SITE_URL = "https://scamscan.io"

STATIC_PAGES = [
    (f"{SITE_URL}/",        "weekly",  "1.0"),
    (f"{SITE_URL}/scan",    "weekly",  "0.9"),
    (f"{SITE_URL}/reports", "daily",   "0.9"),
    (f"{SITE_URL}/report",  "monthly", "0.7"),
]


@app.get("/sitemap.xml", include_in_schema=False)
async def sitemap(session: SessionDep):
    """
    Dynamic XML sitemap consumed by Google Search Console and crawlers.
    Lists all static pages + every user-submitted report (up to 50 000 URLs).
    Submit this URL in Google Search Console so Googlebot discovers new reports.
    """
    result = await session.execute(
        select(Reports.id, Reports.slug, Reports.updated_at, Reports.created_at)
        .order_by(Reports.id.desc())
        .limit(50_000)
    )
    report_rows = result.all()

    url_entries: list[str] = []

    for loc, changefreq, priority in STATIC_PAGES:
        url_entries.append(
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <changefreq>{changefreq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            f"  </url>"
        )

    for row in report_rows:
        lastmod = (row.updated_at or row.created_at).strftime("%Y-%m-%d")
        loc = f"{SITE_URL}/report/show/{row.id}/{row.slug}"
        url_entries.append(
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(url_entries)
        + "\n</urlset>"
    )

    return Response(content=xml, media_type="application/xml")
