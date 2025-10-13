import React from "react";
import Input from "../components/ui/Input.jsx";

export default function Scan() {
    const test = true

    return (
        <section className="relative">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <div className={'bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6'}>
                    <Input label={'Scan websites & wallets'} withIcon={true}/>
                </div>



            </div>
        </section>
    )
}