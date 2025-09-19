import { TriangleAlert, ChevronLeft, Camera, CircleQuestionMark, WalletMinimal, Globe, Plus, HelpCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { SearchField } from "./ui/SearchField";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import validUrl from "valid-url";
import { Input } from "./ui/Input";
import Tiptap from './TipTapEditor'

function ReportForm() {
    const [tooltipContent, setTooltipContent] = useState("ToolTip");
    const [reportData, setReportData] = useState({});
    const [selectedReportSubject, setSelectedReportSubject] = useState("");
    const [content, setContent] = useState("");

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
            description: content
        });
    }, [selectedReportSubject, content]);

    return (
        <form className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <h3 className="flex items-center gap-3 text-lg tracking-wider">
                Report Subject
                <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Select what you want to report")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" />
            </h3>


            
            <div className="flex gap-3">
                {reportOptions.map((option) => (
                    <label key={option.id} className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
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

            <div className="relative mt-10 space-y-6">
                <Input label="Title" maxLength="45" placeholder='Enter a clear and descriptive title for your scam report'/>
                
                <div>
                    <label className="mb-2 block text-lg font-medium tracking-wider text-foreground">
                        What happened
                    </label>
                    <Tiptap content={content} onChange={setContent} />
                </div>

                {!selectedReportSubject && (
                    <div className="absolute top-0 h-full w-full bg-white/80">

                    </div>
                )}
                
            </div>

            {selectedReportSubject === "website" && (
                <div className="mt-5">
                    <Input label="Website URL" placeholder='Enter the URL of the website you want to report' />
                </div>
                
            )}


            {selectedReportSubject === "crypto" && (
                <div className="mt-5">
                    <Input label="Crypto Address" placeholder='Enter the cryptocurrency address you want to report' />
                </div>
            )}

            <hr className="mt-8" />

            <div className="mt-5 flex items-center gap-3 text-lg tracking-wider">
                <Camera className="h-4 w-4" />
                Evidence
            </div>


            <Tooltip anchorSelect=".my-anchor-element" place="top">
                {tooltipContent}
            </Tooltip>
        </form>
    );
}

export default ReportForm;
