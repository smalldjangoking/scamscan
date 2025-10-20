import { useParams } from "react-router-dom";
import SearchAddress from '../components/ui/SearchAddress.jsx'
import {useAddress} from "../utils/hook.js";
import LoadingSpinner from "../components/ui/Loading.jsx";
import React, {useEffect} from "react";
import {Globe} from "lucide-react";
import {Button} from "../components/ui/Button.jsx";
import LikeDislike from "../components/scan/LikesDislike.jsx";
import {Flag, Clock8, RefreshCcw   } from "lucide-react"
import {useState} from "react";

export default function ScanDetail() {
    const { web_url, crypto_address } = useParams();

    const queryValue = web_url || crypto_address;
    const querySubject = web_url ? 'website': 'crypto';
    const [formatted, setFormatted] = useState(null);

    const {data, isError, isLoading, isFetching} = useAddress({
        value: queryValue,
        subject: querySubject,
    })

    useEffect(() => {
        if (data && !isFetching && data.address?.created_at) {
            const date = new Date(data.address.created_at);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
            setFormatted(formattedDate);
        }
    }, [data, isFetching]);



    return (
        <section className="relative h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>

            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <SearchAddress onValue={queryValue}/>

                <div
                    className="mt-6 flex flex-col border border-dashed border-border rounded-xl bg-card/80 backdrop-blur-sm min-h-[150px]">
                    {isLoading ? (
                        <div
                            className="mt-6 flex flex-col items-center text-center border border-dashed border-border rounded-xl py-16 px-4 bg-card/50 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground/80 mt-2 max-w-sm">
                                loading
                            </p>
                        </div>
                    ) : isError ? (
                        <p>Error</p>
                    ) : (
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {crypto_address ?
                                        (<img src={data.address.crypto_logo_url} alt={data.address.crypto_name} className="h-6 w-6" />
                                        ) :
                                        (<Globe className="h-6 w-6" />)
                                    }
                                    {crypto_address ? (data.address.crypto_address) : (data.address.website_url)}
                                </div>

                                <div className="flex items-center">
                                    <div className="flex gap-1">{formatted} <RefreshCcw /></div>
                                </div>
                            </div>
                            <hr className="mt-5 mb-5"/>

                            <div className="flex items-center">
                                likes {data.address.likes}
                                dislikes {data.address.dislikes}
                            </div>

                            <LikeDislike/>

                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
