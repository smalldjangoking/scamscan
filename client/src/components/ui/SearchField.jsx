import {Button} from "./Button.jsx";
import {Search, Globe, Wallet} from "lucide-react";


export function SearchField() {
    const temp = false

    return (
        <div className="w-full max-w-2/3 mx-auto">
            <div className="relative">
                <div className="absolute left-3 top-1/2 p-transform -translate-y-1/2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground"/>
                    {temp === 'website' && <Globe className="h-3 w-3 text-blue-500"/>}
                    {temp === 'crypto' && <Wallet className="h-3 w-3 text-orange-500"/>}
                </div>
                <input
                    type="text"
                    placeholder="Enter website URL or crypto address to scan..."
                    className="file:text-foreground pl-10 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <Button
                    disabled
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg"
                    size="sm"
                >
                    {temp ? "Scanning..." : "Scan"}
                </Button>
            </div>
        </div>
    );
}