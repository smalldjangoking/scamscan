
import { Button } from '../components/ui/Button.jsx'
import Input from "../components/ui/Input.jsx";
import {CircleQuestionMark, FileWarning, TriangleAlert} from "lucide-react";
import {Tooltip} from "react-tooltip";

export default function Scan() {


    const test = false

    return (
        <section className="relative">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <div className={'bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6'}>
                    <CircleQuestionMark size={20} className="scan-help absolute top-5 right-5"/>

                    <Input label={'Scan websites & wallets'} withIcon={true}/>
                </div>

                <div
                    className="mt-5 flex items-center p-4 mb-4 text-sm text-muted-foreground border"
                    role="alert">
                    <TriangleAlert className={"mr-2"} />
                    <span className="sr-only">Info</span>
                    <div>
                        If you’ve become a victim or spotted suspicious activity, report it through our system.
                        Help keep the community safe — <Button className="p-0" variant={"link"}>report a scam</Button>
                    </div>
                </div>
            </div>

            <Tooltip
                anchorSelect=".scan-help"
                content={`If no results are found, it simply means there’s no information available yet.\nIt doesn’t necessarily indicate anything positive or negative`}
                style={{ whiteSpace: 'pre-line' }}
            />
        </section>
    )
}