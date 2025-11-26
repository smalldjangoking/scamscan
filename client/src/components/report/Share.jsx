import React, { useState, useRef, useEffect } from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    LinkedinIcon,
} from "react-share";
import { createPortal } from "react-dom";
import {X}from "lucide-react";
import { Button } from "../ui/Button";

export default function ShareButtons({ url, title, onClose }) {
    const [copied, setCopied] = useState(false);
    const handleClickContainer = useRef()

    const shareUrl =
        url || (typeof window !== "undefined" ? window.location.href : "");
    const shareTitle = title || "Scamscan";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error("Не удалось скопировать ссылку", e);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                handleClickContainer.current &&
                !handleClickContainer.current.contains(event.target)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!onClose) return null;

    return createPortal(
        // затемнённый фон по всему экрану
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div ref={handleClickContainer} className="w-full max-w-sm mx-4 rounded-2xl border bg-card shadow-xl p-4 md:p-5 relative">

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-[11px] uppercase">
                                Share this report
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Send the link on social media or copy it.
                            </p>
                        </div>

                        <Button
                            className="group"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                        >
                            <X className="group-hover:rotate-255 transition-normal" />
                        </Button>
                    </div>

                    {/* ряд иконок */}
                    <div className="flex justify-center gap-3 py-2">
                        <FacebookShareButton url={shareUrl} quote={shareTitle}>
                            <FacebookIcon size={38} round />
                        </FacebookShareButton>

                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                            <TwitterIcon size={38} round />
                        </TwitterShareButton>

                        <TelegramShareButton url={shareUrl} title={shareTitle}>
                            <TelegramIcon size={38} round />
                        </TelegramShareButton>

                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                            <WhatsappIcon size={38} round />
                        </WhatsappShareButton>

                        <LinkedinShareButton url={shareUrl}>
                            <LinkedinIcon size={38} round />
                        </LinkedinShareButton>
                    </div>

                    {/* поле ссылки + кнопка копирования */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                            Прямая ссылка
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="h-9 flex-1 rounded-lg border bg-muted px-2.5 text-[11px] md:text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring overflow-hidden text-ellipsis"
                                onFocus={(e) => e.target.select()}
                            />
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="h-9 rounded-lg px-3 text-[11px] md:text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
