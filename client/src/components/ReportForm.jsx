import { TriangleAlert, ChevronLeft, Camera, CircleQuestionMark, WalletMinimal, Globe, Plus, HelpCircle, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import { SearchField } from "./ui/SearchField";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import validUrl from "valid-url";
import { Input } from "./ui/Input";
import Tiptap from './TipTapEditor';
import Dropzone from "./ui/FileDropZone";


function ReportForm() {
    const [tooltipContent, setTooltipContent] = useState("ToolTip");
    const [reportData, setReportData] = useState({});
    const [selectedReportSubject, setSelectedReportSubject] = useState("");
    const [reportTitle, setReportTitle] = useState("");
    const [content, setContent] = useState("");
    const [evidence, setEvidence] = useState([]);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [cryptoAddress, setCryptoAddress] = useState("");

    const [verifyFields, SetVerifyFields] = useState([]);

    const fileInputRef = useRef(null);

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

    useEffect(() => {

        setReportData({
            ...reportData,
            reportSubject: selectedReportSubject,
            reportTitle: reportTitle,
            description: content,
            screenshots: evidence,
            websiteUrl: websiteUrl ? websiteUrl : null,
            cryptoAddress: cryptoAddress ? cryptoAddress : null
        });

    }, [selectedReportSubject, content, reportTitle, evidence, websiteUrl, cryptoAddress]);


    useEffect(() => {
        console.log("reportData обновилось:", reportData);
    }, [reportData]);

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
                                onChange={(e) => { setSelectedReportSubject(e.target.value) }}
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

            
            {selectedReportSubject && (
                <>
                    <div className="mt-5 space-y-6">
                        <Input value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} label="Title" maxLength="45" placeholder='Enter a clear and descriptive title for your scam report' />

                        <div>
                            <label className="mb-2 block text-lg font-medium tracking-wider text-foreground">
                                What happened
                            </label>
                            <Tiptap content={content} onChange={setContent} />
                        </div>
                    </div>

                    {selectedReportSubject === "website" && (
                        <div className="mt-5">
                            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} label="Website URL" placeholder='Enter the URL of the website you want to report' />
                        </div>
                    )}

                    {selectedReportSubject === "crypto" && (
                        <div className="mt-5">
                            <Input
                                value={cryptoAddress}
                                onChange={(e) => setCryptoAddress(e.target.value)}
                                label="Crypto Address"
                                placeholder="Enter the cryptocurrency address you want to report"
                            />
                        </div>
                    )}

                    <div className="mt-5 flex items-center gap-3 text-lg tracking-wider">
                        <Camera className="h-4 w-4" />
                        Evidence
                        <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Upload up to 8 photos: screenshots of chats, web pages, or documents (max. 5MB each).")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {evidence.map((file, index) => (
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
                                        onClick={() => setEvidence(evidence.filter((_, i) => i !== index))}
                                        className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100 bg-destructive"
                                    >
                                        <Plus className="h-3 w-3 rotate-45 text-[#fff]" />
                                    </Button>
                                </div>
                                <p className="text-muted-foreground mt-1 truncate text-xs">{file.name}</p>
                            </div>
                        ))}
                        {evidence.length < 8 && <Dropzone onFilesSelected={(newFiles) => setEvidence((prev) => [...prev, ...newFiles])} />}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <Button className="ml-1">
                            Submit Report
                        </Button>
                        <input
                            type="checkbox"
                            className="checkbox-custom"

                        />
                        <p>I agree with all rules and things</p>
                    </div>
                </>
            )}
                

            <Tooltip anchorSelect=".my-anchor-element" place="top">
                {tooltipContent}
            </Tooltip>
        </form>
    );
}

export default ReportForm;
