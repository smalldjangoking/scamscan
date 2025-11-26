import { Context } from "../../main";
import { observer } from "mobx-react-lite";
import { useContext } from "react"
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCommentCreate } from "../../utils/hook"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import LoadingSpinner  from "../ui/Loading"

export default observer(function CreateComment({ reportId, mainForm=false, labelForm=false, mainCommentId=null }) {
    const { store } = useContext(Context)

    const schema = Yup.object().shape({
        comment: Yup.string()
            .max(1000, 'Max 1000 chars')
            .min(10, 'Min 10 chars')
            .required("This field is required"),
    })


    const { register, setValue, getValues, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            comment: "",
        }
    });

    const { mutate: createComment, isPending: isPendingCreate } = useCommentCreate(
        {
            setValue,
        }
    );

    const handleSubmit = () => {
        const data = getValues();
        createComment({ reportId, comment: data.comment, mainCommentId })
    };

    return (
        <>
            {store.accessToken ? (
                <div className={`${mainForm ? 'relative w-full rounded-lg border p-4 bg-card/50 backdrop-blur-sm' : ''}`}>
                    <div className="flex items-stretch gap-3">
                        <div className="flex flex-col justify-center flex-1">
                            <Input {...register("comment")} size="multi" multiline={true} label={labelForm ? "Add comment" : ""} placeholder="Write your comment..." />
                        </div>
                    </div>
                    <div className="flex justify-between w-full items-center">
                        {errors.comment && <p className="text-red-600 text-bold text-sm mt-2">{errors.comment.message}</p>}
                        <div className="flex ml-auto mt-3">
                            <Button
                                disabled={!isValid}
                                onClick={handleSubmit}
                                size="sm"
                                variant="ghost"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                    {isPendingCreate && (
                        <div className="absolute bg-secondary/60 inset-0 w-full h-full flex items-center justify-center z-50">
                            <LoadingSpinner />
                        </div>
                    )}
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
        </>
    )
})