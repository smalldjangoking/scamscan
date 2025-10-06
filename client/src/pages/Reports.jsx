import { Button } from "../components/ui/Button"
import BurgerFilterMenu from "../components/reports/burgerFilterMenu"



export default function Reports() {
    return (
            <section className="relative">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="relative container mx-auto py-10 md:py-20">
                    <h2 className="text-4xl font-bold">Reports Explorer</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        A complete list of all reports collected on the platform.
                    </p>
                    {/* menu */}

                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="ghost" size="sm">Browse</Button>
                            <Button variant="ghost" size="sm">My Reports</Button>
                        </div>

                        <hr className="my-2" />
                        <div>
                            <BurgerFilterMenu />

                        </div>

                    </div>


                    
                </div>
            </section>
    );
}