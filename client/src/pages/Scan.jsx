import {Button} from '../components/ui/Button.jsx'
import Input from "../components/ui/Input.jsx";
import {CircleQuestionMark, TriangleAlert, Bot } from "lucide-react";
import {Tooltip} from "react-tooltip";
import {useState} from "react";

export default function Scan() {
    const [search, setSearch] = useState("");

    const test = false

    return (
        <section className="relative h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <div className={'bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6'}>
                    <CircleQuestionMark size={20} className="scan-help absolute top-5 right-5"/>

                    <Input label={'Enter websites & wallets'} placeholder={'https:// or 0x...'} value={search} callBack={setSearch}/>

                    <div className="flex justify-start items-center gap-4 mt-4">
                        <Button>Search</Button>
                        <Button variant='ghost'>Scan with <Bot size={20}/></Button>
                    </div>
                </div>

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

                    <div role="status" className="max-w-sm animate-pulse blur-[25%] min-h-[120px] opacity-30">
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted-foreground"></div>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-6 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl py-16 px-4 bg-card/50 backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground/80 mt-2 max-w-sm">
                        No scans yet. Start a scan to see if any reports are available
                    </p>
                </div>
            </div>

            <Tooltip
                anchorSelect=".scan-help"
                content={`If no results are found, it simply means there’s no information available yet.\nIt doesn’t necessarily indicate anything positive or negative`}
                style={{whiteSpace: 'pre-line'}}
            />
        </section>
    )
}