import httpx
import logging

logger = logging.getLogger(__name__)

class Ip2whoisAPI:
    BASE_URL = "https://api.ip2whois.com/v2"

    def __init__(self, api_key):
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            timeout=7.0,
        )

    async def whois(self, domain: str):
        resp = await self.client.get(
            self.BASE_URL,
            params={
                "key": self.api_key,
                "domain": domain,
                },
        )
        resp.raise_for_status()
        data = resp.json()
        error = data.get("error")
        if error:
            logger.error(f"API ip2whois error: {error}")
            return None
        return data

    async def close(self):
        await self.client.aclose()
