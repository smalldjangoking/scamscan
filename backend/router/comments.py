from fastapi import APIRouter, HTTPException, Query, status, Path, Depends, Request

from database.database_settings import SessionDep
from schemas import CommentsSchema, CommentSchema
from sqlalchemy import select, func
from database.models import Comments
from schemas import CommentValid
from math import ceil
from database.models import Comments
from services import access_token_valid
from sqlalchemy.orm import selectinload
from limiter import limiter

router = APIRouter(prefix="/v1/report/comments", tags=["comments"])


@router.get('/{report_id}/all', status_code=status.HTTP_200_OK, include_in_schema=False)
async def get_report_comments(session: SessionDep,
                              report_id: int = Path(...,),
                              page: int = Query(ge=0, description="Page number for pagination"),
                              page_size: int = Query(
                                  default=10,
                                  ge=1,
                                  description="Number of reports per page"
                              )
                              ):
    """Returns Comments by report_id"""

    query = (
        select(Comments)
        .where(
            Comments.report_id == report_id,
            Comments.parent_comment_id.is_(None),
            )
        .options(
            selectinload(Comments.user),
            selectinload(Comments.children).selectinload(Comments.user),
        )
        .order_by(
            Comments.id.desc(),
        ))

    count_query = select(func.count()).select_from(query.subquery())

    total_count = (await session.execute(count_query)).scalar_one()

    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await session.execute(query)
    comments = result.scalars().all()
    total_pages = ceil(total_count / page_size) if total_count else 0

    if not comments:
        return {'comments': [], 'total_pages': total_pages, 'comments_total': total_count}

    return CommentsSchema(
        comments=[CommentSchema.model_validate(comment) for comment in comments],
        comments_total=total_count,
        total_pages=total_pages
    )

@router.post('/{report_id}/create', status_code=status.HTTP_201_CREATED, include_in_schema=False)
@limiter.limit("3/min")
async def create_report_comment(session: SessionDep,
                                request: Request,
                                comment: CommentValid,
                                report_id: int = Path(...),
                                user_id: int = Depends(access_token_valid),
                                ):
    """creates a comment to report"""
    new_comment = Comments(
        report_id=report_id,
        user_id=user_id,
        comment=comment.comment,
        parent_comment_id=comment.parent_comment_id
    )

    session.add(new_comment)
    
    try:
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return {"status": "ok"}


@router.delete('/delete/{comment_id}', status_code=status.HTTP_200_OK, include_in_schema=False)
async def delete_report_comment(session: SessionDep,
                                comment_id: int = Path(...),
                                user_id: int = Depends(access_token_valid),
                                ):
    """deletes a comment to report"""
    comment = await session.get(Comments, comment_id)

    if user_id != comment.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this comment")

    await session.delete(comment)
    await session.commit()

    return {"status": "ok"}





