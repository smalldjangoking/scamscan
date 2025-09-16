import { TriangleAlert, ChevronLeft, CircleQuestionMark, WalletMinimal, Globe, Plus, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


function ReportForm() {
    const [tooltipContent, setTooltipContent] = useState("ToolTip");
    const [stepForm, setStepForm] = useState(1);


    const [selectedReportSubject, setSelectedReportSubject] = useState("");


    const handleReportSubjectChange = (event) => {
        const handledValue = event.target.value;
        setSelectedReportSubject(handledValue);
    }


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
        },
        {
            id: "other",
            label: "Other",
            description: "Report other types of scams or fraud",
            icon: <HelpCircle className="h-5 w-5" />,
        }
    ];


	return (
        <form className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex justify-between">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-medium">
                <TriangleAlert />
                Scam Report Form
                </h2>
                { if (stepForm) }
            </div>
            

            <div>

                    {stepForm === 1 && (
                        <>
                            <h3 className="flex items-center gap-2 text-lg tracking-wider">
                                Report Subject

                                <CircleQuestionMark size={16} onMouseEnter={() => setTooltipContent("Select one of the options below to indicate what you want to report")} className="my-anchor-element text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                            </h3>

                            {reportOptions.map((option) => (
                                <label key={option.id} className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50">
                                        <input
                                        type="radio"
                                        name="reportSubject"
                                        value={option.id}
                                        className="radio-custom"
                                        onChange={(event) => handleReportSubjectChange(event)}
                                        />

                                        <div className={`p-2 rounded-full bg-accent/50`}>
                                            {option.icon}
                                        </div>
                                        <div>
                                            <p className="font-medium">{option.label}</p>
                                            <p className="text-muted-foreground text-sm">{option.description}</p>
                                        </div>
                                    </label>
                            ))}
                        <Button disabled={!selectedReportSubject} type="button" onClick={() => setStepForm(2)} size="sm" className="bg-primary mt-5 text-primary-foreground hover:bg-primary/90">
                                Next Step
                                </Button>
                        </>
                        )}




            </div>

            <Tooltip anchorSelect=".my-anchor-element" place="top">
                {tooltipContent}
            </Tooltip>
        </form>
  );
}

export default ReportForm;
