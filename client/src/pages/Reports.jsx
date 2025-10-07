import { Button } from "../components/ui/Button"
import BurgerFilterMenu from "../components/reports/burgerFilterMenu"
import ReportCard from '../components/reports/ReportCard'
import { useReports } from "../components/reports/hook"
import { useState } from "react"


export default function Reports() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10

    const { data, isLoading, isError, error, isFetching } = useReports({
    search,
    page,
    pageSize,
  })


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
                        <div className="mb-5">
                            <BurgerFilterMenu />

                        </div>
                    </div>
                </div>

                    {/* reports */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : isError ? (
                            <div>Error: {error.message}</div>
                        ) : (
                            data?.reports.map((report) => (
                                <ul>
                                    <ReportCard
                                        key={report.id}
                                        report_title={report.report_title}
                                        report_description={report.report_description}
                                        created_at={report.created_at}
                                    />
                                </ul>
                            ))
                        )}
                    </div>
            </section>
    );
}