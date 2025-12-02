import { Button } from "../components/ui/Button.jsx";
import { TriangleAlert, Bot } from "lucide-react";
import SearchAddress from "../components/ui/SearchAddress.jsx";
import { useNavigate } from "react-router-dom";

export default function Scan() {
    const navigate = useNavigate()
  return (
    <section className="relative">
      {/* мягкий градиентный фон */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative container mx-auto px-2 py-8 md:py-16 max-w-4xl">
        {/* основной поисковый компонент */}
        <SearchAddress />

        {/* инфо-алерт */}
        <div
          className="mt-5 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 text-amber-500" />
          <div>
            <p>
              If you’ve become a victim or spotted suspicious activity, report it through our system.
              Help keep the community safe —{" "}
              <Button onClick={() => navigate('/report')} className="p-0 h-auto align-baseline" variant="link">
                report a scam
              </Button>
            </p>
          </div>
        </div>

        {/* блок “под поиск” – сделал как подсказки / описание, чтобы не был пустой */}
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card/80 px-4 py-4 backdrop-blur-sm">
          <h2 className="text-sm font-medium mb-2">
            What can you scan?
          </h2>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Crypto wallet addresses (BTC, ETH, TRON and others)</li>
            <li>Domains and links you’re not sure you can trust</li>
          </ul>
        </div>

        {/* пустой стейт (когда ещё нет результатов) */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-4 py-14 text-center backdrop-blur-sm">
          <Bot className="h-8 w-8 text-muted-foreground/80 mb-3" />
          <p className="text-sm font-medium">
            No scans yet
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground/80">
            Start a scan above to check if any reports are available for the address, URL or project you’re
            worried about.
          </p>
        </div>
      </div>
    </section>
  );
}
