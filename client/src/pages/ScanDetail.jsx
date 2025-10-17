import { useParams } from "react-router-dom";
import SearchAddress from '../components/ui/SearchAddress.jsx'

export default function ScanDetail() {
    const { web_url, crypto_address } = useParams();

    // можно проверить что именно передано
    const queryValue = web_url || crypto_address;

    return (
        <section className="relative h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>

            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <SearchAddress onValue={queryValue}/>

                <div
                    className="mt-6 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl py-16 px-4 bg-card/80 backdrop-blur-sm">

                </div>
            </div>
        </section>
    );
}
