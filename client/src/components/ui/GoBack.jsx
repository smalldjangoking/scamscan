import { useNavigate, useNavigationType } from "react-router-dom";
import { Button } from "../ui/Button";
import {ArrowLeft} from "lucide-react";

export function BackButton() {
    const navigate = useNavigate();
    const navType = useNavigationType();

    const canGoBack = navType === "PUSH" || navType === "REPLACE";

    if (!canGoBack) return null;

    return (
        <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
        </Button>
    );
}