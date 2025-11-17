import {Button} from '../components/ui/Button.jsx'
import Input from "../components/ui/Input.jsx";
import {CircleQuestionMark, TriangleAlert, Bot } from "lucide-react";
import SearchAddress from "../components/ui/SearchAddress.jsx";


export default function Scan() {
    return (
        <section className="relative h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <SearchAddress />

                <div
                    className="mt-5 flex items-center p-4 mb-4 text-sm text-muted-foreground border"
                    role="alert">
                    <TriangleAlert className={"mr-2"}/>
                    <span className="sr-only">Info</span>
                    <div>
                        If you’ve become a victim or spotted suspicious activity, report it through our system.
                        Help keep the community safe — <Button className="p-0" variant={"link"}>report a scam</Button>
                    </div>
                </div>

                <div
                    className="mt-6 flex flex-col border border-dashed border-border rounded-md bg-card/80 backdrop-blur-sm ">

                </div>

                <div
                    className="mt-6 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl py-16 px-4 bg-card/50 backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground/80 mt-2 max-w-sm">
                        No scans yet. Start a scan to see if any reports are available
                    </p>
                </div>
            </div>
        </section>
    )
}