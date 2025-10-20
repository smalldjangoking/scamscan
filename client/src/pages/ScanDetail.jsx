import { useParams } from "react-router-dom";
import SearchAddress from '../components/ui/SearchAddress.jsx'
import {useAddress, useReports} from "../utils/hook.js";
import LoadingSpinner from "../components/ui/Loading.jsx";
import React, {useEffect} from "react";
import {FileWarning, Globe, ThumbsDown, ThumbsUp} from "lucide-react";
import {Button} from "../components/ui/Button.jsx";
import LikeDislike from "../components/scan/LikesDislike.jsx";
import {Flag, Clock8, RefreshCcw   } from "lucide-react"
import {useState} from "react";
import ReportCard from "../components/reports/ReportCard.jsx";

export default function ScanDetail() {
    const { web_url, crypto_address } = useParams();

    const queryValue = web_url || crypto_address;
    const querySubject = web_url ? 'website': 'crypto';
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
    } = useReports({
        address_id: addressId,
        page,
        pageSize,
        enabled: !!addressId && !isAddressFetching, // только после загрузки address
    });

    useEffect(() => {
        if (addressData && !isAddressFetching ) {
            console.log(addressData)
            const date = new Date(addressData.address.created_at);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
            setFormatted(formattedDate);
        }
    }, [addressData, isAddressFetching]);



    return (
        <section className="relative h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>

            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <SearchAddress onValue={queryValue}/>

                <div
                    className="mt-6 flex flex-col border border-dashed border-border rounded-xl bg-card/80 backdrop-blur-sm min-h-[150px]">
                    {isAddressLoading ? (
                        <div
                            className="mt-6 flex flex-col items-center text-center border border-dashed border-border rounded-xl py-16 px-4 bg-card/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground/80 mt-2 max-w-sm">
                                loading
                            </p>
                        </div>
                    ) : isAddressError ? (
                        <p>Error</p>
                    ) : (
                        <div className="p-5">
                            <div className="flex items-center justify-between items-center">
                                <div className="flex gap-2 items-center flex">
                                    {crypto_address ?
                                        (<img src={addressData.address.crypto_logo_url} alt={addressData.address.crypto_name} className="h-6 w-6" />
                                        ) :
                                        (<Globe className="h-6 w-6" />)
                                    }
                                    {crypto_address ? (addressData.address.crypto_address) : (addressData.address.website_url)}
                                </div>

                                <div className="flex items-center">
                                    <div className="flex gap-2">{formatted} <RefreshCcw /></div>
                                </div>
                            </div>
                            <hr className="mt-5 mb-5"/>
                            <div className="flex flex-wrap">
                                {addressData.address.website_url ? (
                                    <div className="flex-1 flex-col items-center justify-center p-2 border min-w-0">
                                        <p className="flex justify-center text-muted-foreground">Useful links</p>

                                        <div className="flex items-center">
                                            <Button variant="ghost"><img className="w-25" src="/VirusTotal.svg" alt="Virustotal" /></Button>
                                            <Button variant="ghost"><img className="w-25" src="/WaybackMachine.svg" alt="Logo" /></Button>
                                            <Button variant="ghost"><img className="w-25"   src="/whois.svg" alt="Whois" /></Button>
                                        </div>
                                    </div>
                                ) : null}

                                <LikeDislike/>
                            </div>

                            <h4 className='flex flex-row items-center mt-10 gap-2'><Flag/> Reports </h4>
                            <hr className="mt-5 mb-5"/>
                            {/* List of Reports */}
                            <div className="">
                                {
                                    isReportsLoading ? (
                                        <div className="col-span-full flex justify-center items-center py-20">
                                            <LoadingSpinner />
                                        </div>
                                    ) : isReportError ? (
                                        <div>Error</div>
                                    ) : reportsData?.reports.length > 0 ? (
                                        (<ul className="grid grid-cols-1">
                                            {reportsData?.reports.map((report) => (
                                                <ReportCard
                                                    key={report.id}
                                                    report_title={report.report_title}
                                                    report_description={report.report_description}
                                                    created_at={report.created_at}
                                                    user_id={report.user_id}

                                                />
                                            ))}
                                        </ul>)
                                    ) : (
                                        <div className="flex flex-1 items-center justify-center min-h-[250px]">
                                            <div className="text-center">
                                                <div
                                                    className="mx-auto mb-4 h-14 w-14 rounded-full border border-dashed flex items-center justify-center">
                                                    <FileWarning className="h-7 w-7 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground">
                                                    We couldn’t find anything. Try updating your search or filters
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            {/* Pagination */}

                            {/* pagination */}
                            {reportsData?.totalPages !== 1 && (
                                <div className="flex justify-center mt-10 space-x-2">
                                    <Button onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                            disabled={page === 1 || isReportFetching}>
                                        {Math.max(page - 1, 1)}
                                    </Button>

                                    <Button variant="ghost" className="cursor-default">{page} of {reportsData?.totalPages}</Button>

                                    <Button className="disabled:hidden"
                                            onClick={() => setPage((old) => Math.min(old + 1, reportsData?.totalPages))}
                                            disabled={page === reportsData?.totalPages || isReportFetching}>
                                        {Math.max(page + 1, reportsData?.totalPages)}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
