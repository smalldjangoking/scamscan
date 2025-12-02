import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAddress, useAddrReports } from "../utils/hook.js";

import SearchAddress from "../components/ui/SearchAddress.jsx";
import LoadingSpinner from "../components/ui/Loading.jsx";
import { Button } from "../components/ui/Button.jsx";
import LikeDislike from "../components/scan/LikesDislike.jsx";
import ReportCard from "../components/reports/ReportCard.jsx";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Pagination from "../components/ui/Paginator.jsx";

import {
  FileWarning,
  Globe,
  Flag,
  Clock8,
  Copy,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function ScanDetail() {
  const { web_url, crypto_address } = useParams();

  const queryValue = web_url || crypto_address;
  const querySubject = web_url ? "website" : "crypto";

  const [formatted, setFormatted] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [copied, setCopied] = useState(false);


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
      const formattedDate = `${date
        .getDate()
        .toString()
        .padStart(2, "0")}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
      setFormatted(formattedDate);
    }
  }, [addressData, isAddressFetching]);

  const handleCopy = () => {
    if (!queryValue) return;
    navigator.clipboard
      .writeText(queryValue)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => { });
  };

  const website = addressData?.address?.website_url;

  return (
    <section className="relative min-h-screen">
      {/* background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative container mx-auto px-2 py-10 md:py-20">
        <SearchAddress onValue={queryValue} />

        <div className="mt-6 flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm min-h-[220px]">
          {/* ========== Address Loading/Error ========== */}
          {isAddressLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner />
              <p className="text-sm text-muted-foreground mt-3">
                Loading address details...
              </p>
            </div>
          ) : isAddressError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileWarning className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Address not found or unreachable.
              </p>
            </div>
          ) : (
            addressData && (
              <div className="p-5 md:p-7 space-y-8">
                {/* Header: Address Info */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {crypto_address ? (
                        <img
                          src={addressData.address.crypto_logo_url}
                          alt={addressData.address.crypto_name}
                          data-tooltip-id="info-tooltip"
                          data-tooltip-content={addressData.address.crypto_name}
                          className="h-7 w-7 rounded-full"
                        />
                      ) : (
                        <Globe
                          className="h-7 w-7 text-primary"
                          data-tooltip-id="info-tooltip"
                          data-tooltip-content="Website"
                        />
                      )}

                      <span className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {crypto_address ? "Crypto address" : "Website"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="font-mono text-sm sm:text-base break-all">
                        {crypto_address
                          ? addressData.address.crypto_address
                          : addressData.address.website_url}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={handleCopy}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        {copied ? "Copied" : "Copy value"}
                      </Button>

                      {!crypto_address && website && (
                        <Button
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          asChild
                        >
                          <a
                            href={
                              website.startsWith("http")
                                ? website
                                : `https://${website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Open website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1">
                      <Clock8
                        className="h-4 w-4"
                        data-tooltip-id="info-tooltip"
                        data-tooltip-content="First report created at"
                      />
                      <span>{formatted || "—"}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-border/70" />

                {/* Useful Links + LikeDislike + WHOIS */}
                <div className="grid gap-4 lg:gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <div className="space-y-4">
                    {website && (
                      <div className="flex flex-col border rounded-xl bg-background/60 p-4 gap-3">
                        <p className="text-sm font-medium">
                          Security tools &amp; OSINT
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          Quickly inspect the website using public scanners.
                        </p>
                        <div className="flex flex-wrap justify-start gap-2">
                          <Button variant="ghost" asChild>
                            <a
                              href={`https://www.virustotal.com/gui/home/search/${website}`}
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
                              href={`https://web.archive.org/web/*/${website}`}
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
                              href={`https://whois.com/whois/${website}`}
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

                      <LikeDislike />
                  </div>

                  {/* WHOIS block only for websites (заглушка) */}
                </div>

                {/* Reports Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="flex items-center gap-2 font-semibold text-lg">
                      <Flag className="h-5 w-5 text-red-500" /> Reports
                    </h4>

                    {reportsData?.total_reports >= 1 && (
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Reports:{" "}
                        <span className="font-semibold">
                          {reportsData?.total_reports ?? 0}
                        </span>
                      </p>
                    )}
                  </div>

                  <hr className="mb-5 border-border/70" />

                  {/* Reports List */}
                  {isReportsLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <LoadingSpinner />
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
                          id={report.id}
                          report_title={report.report_title}
                          report_description={report.report_description}
                          created_at={report.created_at}
                          user_id={report.user_id}
                          slug={report.slug}
                          views={report.views}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-14 w-14 rounded-full border border-dashed flex items-center justify-center mb-4">
                        <FileWarning className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        No reports yet for this address.
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination
                      page={page}
                      totalPages={reportsData?.totalPages}
                      isFetching={isReportFetching}
                      onPageChange={setPage}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <Tooltip id="info-tooltip" />
    </section>
  );
}
