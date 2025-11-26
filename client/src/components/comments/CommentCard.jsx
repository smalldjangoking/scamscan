import { format } from 'timeago.js';
import { Ellipsis } from 'lucide-react';
import { Button } from "../ui/Button"
import { Context } from "../../main";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react"
import CreateComment from "../comments/CreateComment"

export default observer(function CommentCard({ items, reportId, isReply = false }) {
    const { store } = useContext(Context)
    const [reply, setReply] = useState(false)
    const [openReplyComments, setOpenReplyComments] = useState(false)

    const isOwner = store.userId === items.user_id;
    const hasChildren = items.children?.length > 0;

    return (
        <>
            <div
                className={`
                    rounded-lg border w-full
                    ${isReply ? "relative bg-card mt-2" : "bg-card mt-3 shadow-sm"}
                `}
            >
                <div className={isReply ? "px-3 py-2 sm:px-4 sm:py-2.5" : "px-5 py-3"}>
                    <div className="flex justify-between items-start w-full gap-2">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <p
                                    className={
                                        isReply
                                            ? "text-sm sm:text-[15px] font-medium leading-none"
                                            : "text-lg font-medium leading-none"
                                    }
                                >
                                    {items.user.nickname}
                                </p>
                                <span
                                    className={
                                        "text-gray-500 font-medium leading-none " +
                                        (isReply ? "text-[11px] sm:text-xs" : "text-sm")
                                    }
                                >
                                    {format(items.created_at)}
                                </span>
                            </div>
                        </div>

                        {isOwner && (
                            <div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={isReply ? "h-7 w-7" : "h-8 w-8"}
                                >
                                    <Ellipsis className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div
                        className={
                            "mt-2 text-foreground break-words " +
                            (isReply ? "text-xs sm:text-sm" : "text-sm sm:text-[15px]")
                        }
                    >
                        {items.comment}
                    </div>
                </div>

                {/* Нижняя панель — только для главных комментариев */}
                {!isReply && (
                    <div className="mb-2 ml-1 mt-1 flex flex-wrap items-center gap-2">
                        {hasChildren && (
                            <Button
                                onClick={() => setOpenReplyComments((v) => !v)}
                                variant="link"
                                className="px-2 text-xs sm:text-sm"
                            >
                                {openReplyComments
                                    ? `Hide Replies (${items.children.length})`
                                    : `Comment Replies (${items.children.length})`}
                            </Button>
                        )}

                        {reportId && store.accessToken && (
                            <Button
                                onClick={() => setReply(true)}
                                variant="ghost"
                                size="sm"
                                className="h-7 px-3 text-xs sm:text-sm"
                            >
                                Reply
                            </Button>
                        )}
                    </div>
                )}

                {/* Make Comment */}
                {!isReply && reply && (
                    <div className="mt-2 px-3 pb-3 sm:px-4">
                        <CreateComment mainCommentId={items.id} reportId={reportId} />
                    </div>
                )}
            </div>

            {/* Replies */}
            {!isReply && openReplyComments && hasChildren && (
                <div className="border-l mt-1 ml-3 sm:ml-5 pl-3 sm:pl-4 space-y-2">
                    {items.children.map((c) => (
                        <CommentCard
                            key={c.id}
                            items={c}
                            reportId={reportId}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </>
    )
})
