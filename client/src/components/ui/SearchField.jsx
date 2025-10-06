import {Button} from "./Button.jsx";
import { Search, Globe, Wallet } from "lucide-react";
import { useState, useEffect} from "react";



export function SearchField({ inputType }) {
    const [searchInput, setSearchInput] = useState("");

    let inputLabel = '';

    if (inputType === "Crypto Address") {
        inputLabel = 'Enter a Crypto Address'
    }

    if (inputType === "Website") {
        inputLabel = 'Enter a Website URL';

    }

    const defaultLabel = "Enter website URL or crypto address to scan..."





    return (
        <div className="mx-auto w-full max-w-2/3">
            <div className="relative">
                <div className="p-transform absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2">
                    <Search className="text-muted-foreground h-4 w-4"/>
                </div>
                <input
                    type="text"
                    placeholder={inputLabel ? inputLabel : defaultLabel}
                    className="bg-input-background flex h-12 w-full min-w-0 rounded-md border border-input px-3 py-1 pl-10 text-base transition-[color,box-shadow] outline-none selection:text-primary-foreground selection:bg-primary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                    onChange={(e) => { setSearchInput(e.target.value); }}
                    value={searchInput}
                />
            </div>
        </div>
    );
}