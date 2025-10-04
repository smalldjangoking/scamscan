import { MessageSquareWarning, Camera, CircleQuestionMark, WalletMinimal, Globe, Plus} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import validUrl from "valid-url";
import { Input } from "./ui/Input";
import Tiptap from './TipTapEditor';
import Dropzone from "./ui/FileDropZone";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CryptoDropDownMenu from "./ui/CryptoDropDownMenu";


function ReportForm() {
    const schema = Yup.object().shape({

        reportSubject: Yup.string()
            .oneOf(["crypto", "website"], "Select a valid subject")
            .required("Please select a subject"),

        reportTitle: Yup.string()
            .min(10, "At least 10 chars")
            .max(35, "Max 35 chars")
            .required("Title is required"),

        description: Yup.string()
            .min(500, "At least 500 chars")
            .max(2000, "Max 2000 chars")
            .required("Description is required"),

        screenshots: Yup.array()
            .min(0)
            .max(8, "You can upload up to 8 screenshots")
            .of(
                Yup.mixed()
                    .test("fileSize", "File is too large", (file) => !file || file.size <= 5 * 1024 * 1024)
                    .test("fileType", "Unsupported file format", (file) =>
                        !file || ["image/jpeg", "image/png", "image/heic"].includes(file.type)
                )
            ),

        websiteUrl: Yup.string().when("reportSubject", {
            is: "website",
            then: (s) => s.required("Website URL is required").test("is-valid-url", "Invalid URL", (value) => validUrl.isUri(value)),
            otherwise: (s) => s.notRequired()
        }),

        cryptoChosen: Yup.object().when("reportSubject", {
            is: "crypto",
            then: (s) => s.shape({
                name: Yup.string().required("Cryptocurrency name is required"),
                image: Yup.string().required("Cryptocurrency image is required")
            }).required("Please select a cryptocurrency"),
            otherwise: (s) => s.notRequired()
        }),


        cryptoAddress: Yup.string().when(["reportSubject"], {
            is: (reportSubject) => reportSubject === "crypto",
            then: (s) => s.min(15, "Crypto address must be at least 15 characters").required("Crypto address is required"),
            otherwise: (s) => s.notRequired()
        }),

        checkBox: Yup.object().shape({
            accepted: Yup.boolean().oneOf([true], "You must accept the terms")
        })
        .required("You must agree to the terms"),
    });


    const { register, watch, setValue, control, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            reportSubject: "",
            reportTitle: "",
            description: "",
            websiteUrl: "",
            cryptoAddress: "",
            screenshots: [],
            cryptoChosen: null,
            checkBox: {accepted: false}
        }
    });


    const selectedReportSubject = watch("reportSubject");
    const screenshots = watch("screenshots");

    const [tooltipContent, setTooltipContent] = useState("ToolTip");


    const reportOptions = [
        {
            id: "crypto",
            label: "Crypto Address",
            description: "Report suspicious cryptocurrency addresses",
            icon: <WalletMinimal className="h-5 w-5" />,
        },
        {
            id: "website",
            label: "Website",
            description: "Report malicious or scam websites",
            icon: <Globe className="h-5 w-5" />,
        }
    ];

    return (
        <form className="relative rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm">

            <h3 className="flex items-center gap-3 text-lg tracking-wider">
                Report Subject
                <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Select what you want to report")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" />
            </h3>

            <div className="flex gap-3">
                {reportOptions.map((option) => (
                    <label key={option.id} className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 backdrop-blur-sm transition-colors hover:bg-accent/50">
                        <input
                            type="radio"
                            name="reportSubject"
                            value={option.id}
                            className="radio-custom"
                            {...register("reportSubject")}
                        />
                        <div className={`p-2 rounded-full bg-accent/50 hidden md:flex`}>
                            {option.icon}
                        </div>
                        <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-muted-foreground text-sm">{option.description}</p>
                        </div>
                    </label>
                ))}
            </div>


            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                selectedReportSubject ? 'max-h-screen opacity-100 transform translate-y-0' 
                    : 'max-h-0 opacity-0 transform -translate-y-2'
            }`}>
                    <div className="mt-5">
                        <Input aria-invalid={!!errors.reportTitle} {...register("reportTitle")} label="Title" placeholder='Enter a clear and descriptive title for your scam report' />
                        {errors.reportTitle && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.reportTitle.message}</p>}
                        <div className="mt-5">
                            <label className="mb-2 block text-lg font-medium tracking-wider text-foreground">
                                What happened
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Tiptap
                                        content={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        error={!!errors.description}
                                    />
                                )}
                            />
                            {errors.description && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.description.message}</p>}
                        </div>
                    </div>

                    {errors.cryptoChosen && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.cryptoChosen.message}</p>}

                    {selectedReportSubject === "website" && (
                        <div className="mt-5">
                            <Input {...register("websiteUrl")} label="Website URL" placeholder='Enter the URL of the website you want to report' />
                            {errors.websiteUrl && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.websiteUrl.message}</p>}
                        </div>
                    )}

                    {/* Report crypto Address */}
                    {selectedReportSubject === "crypto" && (
                        <div className="mt-5">
                            <div className="flex items-center gap-3">
                               <h3 className="text-lg font-medium tracking-wider text-foreground">Report an address</h3>
                            <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Select a blockchain network and write an address")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" /> 
                            </div>
                            <Controller
                                name="cryptoChosen"
                                control={control}
                                render={({ field }) => (
                                    <CryptoDropDownMenu
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={!!errors.cryptoChosen}
                                    />
                                )}
                            />
                            {errors.cryptoChosen && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.cryptoChosen.message}</p>}
                            <Input
                                {...register("cryptoAddress")}
                                placeholder="Enter the cryptocurrency address you want to report"
                            />
                            {errors.cryptoAddress && <p className="mt-2 flex items-center gap-2 text-sm text-destructive"><MessageSquareWarning size="20" />{errors.cryptoAddress.message}</p>}
                        </div>
                    )}

                    
                    {/* Screenshot field */}
                    <div className="mt-6 flex items-center gap-3 text-lg tracking-wider">
                        <Camera className="h-4 w-4" />
                        Evidence
                        <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Upload up to 8 photos: screenshots of chats, web pages, or documents (max. 5MB each).")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {screenshots.map((file, index) => (
                            <div key={index} className="group relative">
                                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-gray-100">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="evidence"
                                        className="h-full w-full object-cover"
                                    />
                                    <Button
                                        variant="link"
                                        size="icon"
                                        onClick={() => setValue('screenshots', screenshots.filter((_, i) => i !== index))}
                                        className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100 bg-destructive"
                                    >
                                        <Plus className="h-3 w-3 rotate-45 text-[#fff]" />
                                    </Button>
                                </div>
                                <p className="text-muted-foreground mt-1 truncate text-xs">{file.name}</p>
                            </div>
                        ))}
                        {screenshots.length < 8 && <Dropzone onFilesSelected={(newFiles) => setValue('screenshots', [...screenshots, ...newFiles], { shouldValidate: true })} />}
                    </div>

                    {/* Submit button */}
                    <div className="mt-5 flex items-center gap-3">
                        <Button disabled={!isValid} className="ml-1">
                            Submit Report
                        </Button>
                        <input
                            type="checkbox"
                            className="checkbox-custom"
                            {...register("checkBox.accepted")}
                        />
                        <p>I agree with all rules and things</p>
                    </div>
                </div>
                

            <Tooltip anchorSelect=".my-anchor-element" place="top">
                {tooltipContent}
            </Tooltip>
        </form>
    );
}

export default ReportForm;
