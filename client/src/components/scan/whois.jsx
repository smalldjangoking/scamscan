import {
    CalendarClock, AlarmClock, ShieldQuestion, Server, Building2
} from "lucide-react";

export default function Whois({ whois }) {
    if (!whois) return null;
    const isMoreThanOneYear = (new Date(whois.web_expire_date) - new Date()) / (1000 * 60 * 60 * 24)


    return (
        <div className="flex flex-col border rounded-xl bg-card/80 backdrop-blur-sm p-4 sm:p-5 gap-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <ShieldQuestion className="h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold tracking-tight">WHOIS information</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                    Auto-fetched OSINT
                </span>
            </div>

            <p className="text-xs text-muted-foreground">
                Basic WHOIS metadata for this domain. Use this info to quickly estimate how fresh and trustworthy the website might be.
            </p>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Created */}
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            <CalendarClock className="h-3.5 w-3.5 text-primary/80" />
                            Created
                        </span>
                        <span className={`${whois.domain_age < 365 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"} rounded-full  px-2 py-0.5 text-[10px] font-medium `}>
                            {whois.domain_age} days old
                        </span>
                    </div>
                    <p className="text-xs font-medium text-foreground/90">
                        {new Date(whois.web_create_date).toLocaleString()}
                    </p>
                </div>

                {/* Expires */}
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            <AlarmClock className="h-3.5 w-3.5 text-primary/80" />
                            Expires
                        </span>
                        <span className={`${isMoreThanOneYear < 365 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"} rounded-full  px-2 py-0.5 text-[10px] font-medium `}>
                            {isMoreThanOneYear > 365 ? "1 year +" : "< 1 year left"}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-foreground/90">
                        {new Date(whois.web_expire_date).toLocaleString()}
                    </p>
                </div>

                {/* Registrar */}
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary/80" />
                        Registrar
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                        {whois.registrar_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        Common retail registrar – check if this matches your expectations.
                    </p>
                </div>

                {/* Nameservers */}
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <Server className="h-3.5 w-3.5 text-primary/80" />
                        Nameservers
                    </span>
                    {whois.nameservers.map((ns, index) => (
                        <p key={index} className="text-xs font-medium text-foreground/90">
                            {ns}
                        </p>
                    ))}
                    <p className="text-[11px] text-muted-foreground">
                        {whois.nameservers.length} nameservers found
                    </p>
                </div>
            </div>
        </div>
    )
}