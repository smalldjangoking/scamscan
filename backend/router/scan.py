from math import ceil

from fastapi import APIRouter, Query, HTTPException, Depends, Path
from sqlalchemy import select, func, case
from starlette import status
from database.database_settings import SessionDep
from database.models import Addresses, Reports, Address_votes
from schemas import AddressListReportSchema, AddressReportSchema, UserVote, SubjectEnum, AddressAPISchema
from services import access_token_valid
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/v1/scan", tags=["scan"])


@router.get('/address', status_code=status.HTTP_200_OK)
async def get_address(session: SessionDep,
                      v: str = Query(alias="value", description="Address value to search in Addresses", max_length=150,
                                     min_length=5),
                      s: SubjectEnum = Query(alias="subject", description="[crypto, website] are only allowed.")
                      ):
    """Finds Address by Input, Filers by subject"""

    if s == SubjectEnum.crypto:
        address_query = select(Addresses).where(
            Addresses.subject == s,
            Addresses.crypto_address == v
        )
    else:
        address_query = select(Addresses).where(
            Addresses.subject == s,
            Addresses.website_url == v
        ).options(
            selectinload(Addresses.whois)
        )

    address_result = await session.execute(address_query)
    address = address_result.scalar_one_or_none()


    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    return {"address": AddressAPISchema.model_validate(address)}


@router.get('/{address_id}/reports', status_code=status.HTTP_200_OK)
async def get_reports(session: SessionDep,
                      address_id: int,
                      page: int = Query(
                          default=1,
                          ge=1,
                          description="Current page number for pagination"
                      ),
                      page_size: int = Query(
                          default=10,
                          ge=1,
                          description="Number of reports per page"
                      )
                      ):
    """Returns Reports by address_id"""
    
    base_query = select(Reports).where(Reports.address_id == address_id)

    count_query = select(func.count()).select_from(base_query.subquery())
    total_count = (await session.execute(count_query)).scalar_one()

    paged_query = base_query.order_by(Reports.id.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(paged_query)
    reports = result.scalars().all()

    total_pages = ceil(total_count / page_size) if total_count else 1

    return AddressListReportSchema(
        reports=[AddressReportSchema.model_validate(report) for report in reports],
        totalPages=total_pages,
        total_reports=total_count
    )

@router.post('/{address_id}/vote', status_code=status.HTTP_200_OK, include_in_schema=False)
async def add_vote(session: SessionDep,
                   vote: UserVote,
                   address_id: int = Path(...,),
                   user_id: int = Depends(access_token_valid),
                   ):
    """Creates a vote from user"""

    user_vote = await (session
                 .scalar(select(Address_votes)
                         .where(
                             Address_votes.address_id == address_id,
                             Address_votes.user_id == user_id)))
    
    if not user_vote:
        new_vote = Address_votes(
            user_id = user_id,
            address_id = address_id,
            value = vote.value,
            )
        session.add(new_vote)
    
    elif user_vote.value == vote.value:
        await session.delete(user_vote)

    elif user_vote.value != vote.value:
        user_vote.value = vote.value

    await session.commit()
    return {'status': 'ok'}


@router.get('/{address_id}/votes', status_code=status.HTTP_200_OK, include_in_schema=False)
async def get_votes(session: SessionDep,
                    address_id: int = Path(...,)):
    """Retrive all votes [Like, Dislike] by address_id"""

    result = await (session
                   .execute(
                       select(
                           func.count(case((Address_votes.value == 1, 1))).label("likes"),
                           func.count(case((Address_votes.value == -1, 1))).label("dislikes")
                           )
                           .where(Address_votes.address_id == address_id)))
    
    row = result.one()
    
    return {
        "status": "ok",
        "likes": row.likes,
        "dislikes": row.dislikes
    }