import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from "../ui/Button.jsx"
import { likeDislikeMutation, useLikeDislike } from "../../utils/hook.js"
import LoadingSpinner from "../ui/Loading.jsx"
import React, { useContext } from "react";
import { Context } from "../../main";
import { observer } from "mobx-react-lite";

function LikeDislike({ addressId }) {
    if (!addressId) return null;

    const { store } = useContext(Context)
    const { data: likeDislikeData, isLoading } = useLikeDislike(
        addressId
    )
    const { mutate: likeDislikeMutate, isPending: isPendingMutate } = likeDislikeMutation()
    const handleVote = (value) => {
        likeDislikeMutate({ addressId, value })
    }

    const likes = likeDislikeData?.likes ?? 0
    const dislikes = likeDislikeData?.dislikes ?? 0
    const user = store.userId

    return (
        <div className="relative flex flex-col border rounded-xl bg-background/60 p-4 gap-3 justify-center items-center">
            <p className="text-sm font-medium">Community score</p>
            <div>
                <Button disabled={!user} onClick={() => handleVote(1)} variant="ghost"><ThumbsUp className="text-success" />{likes}</Button>
                <Button disabled={!user} onClick={() => handleVote(-1)} variant="ghost"><ThumbsDown className="text-destructive" />{dislikes}</Button>
            </div>
            {(isLoading || isPendingMutate) && (
                <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    )
}

export default observer(LikeDislike);