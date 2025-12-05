import {
    MessageSquare
} from "lucide-react";
import { useInfinityComments } from "../../utils/hook"
import LoadingSpinner from "../ui/Loading"
import CommentCard from "../comments/CommentCard"
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateComment from "../comments/CreateComment"

export default function Comments({ reportId, report_owner }) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfinityComments(reportId);

    const comments = data?.pages.flatMap((p) => p.comments) ?? [];

    return (
        <div className="mt-10 border rounded-xl bg-card/80 backdrop-blur-sm p-6">
            <h3 className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <p className="font-semibold text-foreground">Comments </p>
            </h3>

            {/* Add Comment */}

            <CreateComment reportId={reportId} mainForm={true} labelForm={true} />
            


            {/* Comments */}

            <InfiniteScroll
                className="flex flex-col gap-3 mt-5"
                dataLength={comments.length}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={<div className="flex justify-center py-4"><LoadingSpinner /></div>}
            >
                {comments.map((c) => (
                    <CommentCard key={c.id} items={c} reportId={reportId} report_owner={report_owner} />
                ))}
            </InfiniteScroll>
        </div>
    )
}