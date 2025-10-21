import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAddress, useAddrReports} from "../utils/hook.js";

import SearchAddress from "../components/ui/SearchAddress.jsx";
import LoadingSpinner from "../components/ui/Loading.jsx";
import {Button} from "../components/ui/Button.jsx";
import LikeDislike from "../components/scan/LikesDislike.jsx";
import ReportCard from "../components/reports/ReportCard.jsx";
import {Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Pagination from '../components/ui/Paginator.jsx'

import {
    FileWarning,
    Globe,
    Flag,
    Clock8,
} from "lucide-react";

export default function ScanDetail() {
    const {web_url, crypto_address} = useParams();

    const queryValue = web_url || crypto_address;
    const querySubject = web_url ? "website" : "crypto";

    const [formatted, setFormatted] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const {
        data: addressData,
        isLoading: isAddressLoading,
        isFetching: isAddressFetching,
        isError: isAddressError,
    } = useAddress({
        value: queryValue,
        subject: querySubject,
    });

    const addressId = addressData?.address?.id;

    const {
        data: reportsData,
        isLoading: isReportsLoading,
        isError: isReportError,
        isFetching: isReportFetching,
    } = useAddrReports({
        address_id: addressId,
        page,
        pageSize,
    });

    useEffect(() => {
        if (addressData && !isAddressFetching) {
            const date = new Date(addressData.address.created_at);
            const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
                date.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}.${date.getFullYear()} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
            setFormatted(formattedDate);
        }
    }, [addressData, isAddressFetching]);

    return (
        <section className="relative min-h-screen">
            {/* background gradient */}
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>

            <div className="relative container mx-auto px-2 py-10 md:py-20">
                <SearchAddress onValue={queryValue}/>

                <div
                    className="mt-6 flex flex-col rounded-xl border border-dashed border-border bg-card/80 backdrop-blur-sm min-h-[200px]">
                    {/* ========== Address Loading/Error ========== */}
                    {isAddressLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <LoadingSpinner/>
                            <p className="text-sm text-muted-foreground mt-3">
                                Loading address details...
                            </p>
                        </div>
                    ) : isAddressError ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <FileWarning className="h-10 w-10 text-muted-foreground mb-3"/>
                            <p className="text-muted-foreground">
                                Address not found or failed to load.
                            </p>
                        </div>
                    ) : (
                        addressData && (
                            <div className="p-5">
                                {/* Header: Address Info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {crypto_address ? (
                                            <img
                                                src={addressData.address.crypto_logo_url}
                                                alt={addressData.address.crypto_name}
                                                data-tooltip-id="info-tooltip"
                                                data-tooltip-content={addressData.address.crypto_name}
                                                className="h-6 w-6"
                                            />
                                        ) : (
                                            <Globe
                                                className="h-6 w-6 text-muted-foreground"
                                                data-tooltip-id="info-tooltip"
                                                data-tooltip-content="Website"
                                            />
                                        )}
                                        <span className="truncate font-medium">
                      {crypto_address
                          ? addressData.address.crypto_address
                          : addressData.address.website_url}
                    </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock8
                                            className="h-4 w-4"
                                            data-tooltip-id="info-tooltip"
                                            data-tooltip-content="First Report Created at"

                                        />
                                        {formatted}
                                    </div>
                                </div>

                                <hr className="my-5 border-border/70"/>

                                {/* Useful Links + LikeDislike */}
                                <div className="flex flex-wrap gap-4">
                                    {addressData.address.website_url && (
                                        <div className="flex flex-col flex-1 border rounded-lg p-3 min-w-[220px]">
                                            <p className="text-sm text-center text-muted-foreground mb-2">
                                                Useful links
                                            </p>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    asChild
                                                >
                                                    <a
                                                        href={`https://www.virustotal.com/gui/home/search/${addressData.address.website_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            className="h-6"
                                                            src="/VirusTotal.svg"
                                                            alt="VirusTotal"
                                                        />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" asChild>
                                                    <a
                                                        href={`https://web.archive.org/web/*/${addressData.address.website_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            className="h-6"
                                                            src="/WaybackMachine.svg"
                                                            alt="Wayback Machine"
                                                        />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" asChild>
                                                    <a
                                                        href={`https://whois.com/whois/${addressData.address.website_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            className="h-6"
                                                            src="/whois.svg"
                                                            alt="Whois"
                                                        />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <LikeDislike/>
                                </div>

                                {/* Reports Section */}
                                <h4 className="flex items-center gap-2 mt-10 font-semibold text-lg">
                                    <Flag className="h-5 w-5 text-accent"/> Reports
                                </h4>
                                <hr className="my-5 border-border/70"/>

                                {/* Reports List */}
                                {isReportsLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <LoadingSpinner/>
                                    </div>
                                ) : isReportError ? (
                                    <div className="text-center text-muted-foreground py-10">
                                        Failed to load reports.
                                    </div>
                                ) : reportsData?.reports.length > 0 ? (
                                    <ul className="space-y-4">
                                        {reportsData.reports.map((report) => (
                                            <ReportCard
                                                key={report.id}
                                                report_title={report.report_title}
                                                report_description={report.report_description}
                                                created_at={report.created_at}
                                                user_id={report.user_id}
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div
                                            className="h-14 w-14 rounded-full border border-dashed flex items-center justify-center mb-4">
                                            <FileWarning className="h-7 w-7 text-muted-foreground"/>
                                        </div>
                                        <p className="text-muted-foreground">
                                            No reports yet for this address.
                                        </p>
                                    </div>
                                )}

                                {/* Pagination */}
                                <Pagination
                                    page={page}
                                    totalPages={reportsData?.totalPages}
                                    isFetching={isReportFetching}
                                    onPageChange={setPage}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
            <Tooltip id="info-tooltip"/>
        </section>
    );
}
