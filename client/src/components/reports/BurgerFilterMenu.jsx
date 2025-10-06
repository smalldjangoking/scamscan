import { Button } from "../ui/Button"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function BurgerFilterMenu() {
    const [filterMenu, setFilterMenu] = useState(false);



    return (
    <>
        <Button onClick={() => setFilterMenu(!filterMenu)} variant="ghost" size="sm"  className="relative p-2 border rounded">
            <Menu className="size-5" />
        </Button>

        <div className={`${filterMenu ? 'block' : 'hidden'} absolute`}>
            <ul className="bg-primary-foreground/95 p-3 rounded shadow-lg w-48">
                <li className="p-2 border-b">
                    Cryptocurrencies
                </li>
                <li className="p-2 border-b">
                    Websites
                </li>
            </ul>
        </div>
    </> 
    )
}