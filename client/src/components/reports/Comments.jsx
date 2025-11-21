import {
    MessageSquare,
    Shield
} from "lucide-react";
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

export default function Comments(reportId) {
    return (
        <div className="mt-10 border rounded-xl bg-card/80 backdrop-blur-sm p-6">
            <h3 className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <p className="font-semibold text-foreground">Comments </p>
            </h3>
            {false ? (
                <div className="w-full rounded-lg border p-4 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-stretch gap-3">
                        <div className="flex flex-col justify-center flex-1">
                            <Input label="Add comment" placeholder="Write your comment..." />
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <Button size="sm" variant="ghost">
                            Submit
                        </Button>
                    </div>
                </div>
            )
                :
                (
                    <div className="relative">
                        <div className="w-full rounded-lg border p-4 bg-card/50 backdrop-blur-sm">
                            <div className="flex items-stretch gap-3">
                                <div className="flex flex-col justify-center flex-1">
                                    <Input label="Add comment" placeholder="Write your comment..." disabled />
                                </div>
                            </div>

                            <div className="flex justify-end mt-3">
                                <Button size="sm" variant="ghost" disabled>
                                    Submit
                                </Button>
                            </div>
                        </div>

                        <div className="
                                        pointer-events-none
                                        absolute inset-0
                                        bg-gradient-to-b
                                        from-background/95
                                        via-background/70
                                        to-background/10
                                        rounded-lg
                        " />

                        <div className="
                                        absolute inset-0
                                        flex flex-col items-center justify-center
                                        gap-1
                                        text-sm font-medium
                                        text-muted-foreground
                        ">
                            <span className="px-2 py-1 bg-background/70 backdrop-blur-sm rounded-md">
                                Log in or register to share your thoughts
                            </span>
                        </div>
                    </div>
                )}
        </div>
    )
}