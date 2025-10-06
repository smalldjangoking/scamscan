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
            <ul>
                <li>
                    <ul>
                        <li></li>
                    </ul>
                </li>

            </ul>
        </div>
    </> 
    )
}