from fastapi import APIRouter, Query, HTTPException
from starlette import status
from database_settings import SessionDep
from linkify_it import LinkifyIt
from fastapi.responses import RedirectResponse


router = APIRouter(prefix="/api/scan", tags=["scan"])
linkify = LinkifyIt()

@router.get('/router', status_code=status.HTTP_200_OK)
async def router_check(session: SessionDep,
                       v: str = Query(alias="value", description="Check value for affiliation", max_length=150, min_length=5),
                       ):
    """Routes input to different paths"""

    if len(v.split()) != 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if linkify.test(v):
        return {'website': v}

    else:
        return {'crypto': v}



