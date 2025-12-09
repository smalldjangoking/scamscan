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
        try:
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
        except httpx.HTTPStatusError as exc:
            logger.error(
                f"API ip2whois HTTP error {exc.response.status_code} "
                f"for domain {domain}: {exc}"
                )
            return None
        
        except httpx.HTTPError as exc:
            logger.error(f"API ip2whois request failed for {domain}: {exc}")
            return None

    async def close(self):
        await self.client.aclose()
