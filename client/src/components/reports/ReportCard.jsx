import { Globe, CalendarDays, HatGlasses, Eye, User, Wallet } from "lucide-react";
import { Button } from "../ui/Button";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

const ReportCard = ({
    id,
    crypto_name,
    crypto_logo_url,
    report_title,
    report_description,
    user_id,
    crypto_address,
    website_url,
    created_at,
    slug,
    views,
}) => {
    const navigate = useNavigate();

    const rawDescription = report_description || "";
    const cleanDescription = DOMPurify.sanitize(rawDescription, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    const maxDescriptionLength = 255;
    const shortDescription =
        cleanDescription.length > maxDescriptionLength
            ? cleanDescription.slice(0, maxDescriptionLength) + "..."
            : cleanDescription;

    const date = new Date(created_at);
    const formatted = `${date
        .getDate()
        .toString()
        .padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    const handleOpenDetails = () => {
        navigate(`/report/show/${id}/${slug}`);
    };

    const handleScanNavigate = () => {
        navigate(
            `/scan/${crypto_name ? "crypto" : "website"}/${crypto_address || website_url}`,
        );
    };

    const isCrypto = Boolean(crypto_address);
    const isWebsite = Boolean(website_url);

    return (
        <li
            className={`flex flex-col min-w-[250px] min-h-[250px] rounded border p-5 shadow-md transform transition duration-300 md:hover:scale-101 hover:shadow-lg ${user_id ? "border-green-500" : "border"
                }`}
        >
            <div className="flex justify-between items-center">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {user_id ? (
                        <>
                            <User className="h-7 w-7" />
                            <span>Registered user</span>
                        </>
                    ) : (
                        <>
                            <HatGlasses className="h-7 w-7" />
                            <span>Guest report</span>
                        </>
                    )}
                </div>

                {/* RIGHT SIDE */}
                {(crypto_name || isWebsite) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {crypto_name ? (
                            <>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                                    <img
                                        src={crypto_logo_url}
                                        alt={crypto_name}
                                        className="h-5 w-5 object-contain"
                                    />
                                </div>
                                <span className="uppercase tracking-wide">{crypto_name}</span>
                            </>
                        ) : (
                            <>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                                    <Globe className="h-4 w-4" />
                                </div>
                                <span className="uppercase tracking-wide">Website</span>
                            </>
                        )}
                    </div>
                )}
            </div>


            {(crypto_address || website_url) && (
                <div className="mt-3 mb-3">
                    <Button
                        onClick={handleScanNavigate}
                        size="sm"
                        variant="ghost"
                        className="flex items-center gap-2 text-xs px-3 py-2
                       rounded-lg border border-border hover:bg-accent/30 
                       transition max-w-full"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted">
                            {crypto_address ? (
                                <Wallet className="h-3 w-3 text-muted-foreground" />
                            ) : (
                                <Globe className="h-3 w-3 text-muted-foreground" />
                            )}
                        </span>

                        <span className="truncate max-w-[180px] text-left font-medium">
                            {crypto_address || website_url}
                        </span>
                    </Button>
                </div>
            )}


            <div
                onClick={handleOpenDetails}
                className="mt-4 flex-1 max-w-full cursor-pointer overflow-hidden"
            >
                <h3 className="mb-2 text-xl font-semibold tracking-wide">
                    {report_title}
                </h3>
                <p
                    className="text-sm text-muted-foreground leading-relaxed min-h-[90px] max-w-[40ch] break-words"
                >
                    {shortDescription}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{views ?? 0}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatted}</span>
                </div>
            </div>
        </li>
    );
};

export default ReportCard;
