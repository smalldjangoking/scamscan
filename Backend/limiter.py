from slowapi import Limiter
from fastapi import Request
import logging


def get_real_ip(request: Request):
    #Cloudflare
    forwarded_ip = request.headers.get("CF-Connecting-IP")
    if forwarded_ip:
        return forwarded_ip
    #User ip
    if request.client and request.client.host:
        return request.client.host
    
    logging.warning('Undefined ip address in get_real_ip()')
    return "127.0.0.1"


limiter = Limiter(
    key_func=get_real_ip,
    default_limits=["50/minute"]
    )