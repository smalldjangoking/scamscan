import { Button } from "../components/ui/Button"
import BurgerFilterMenu from "../components/reports/burgerFilterMenu"
import ReportCard from '../components/reports/ReportCard'
import { useReports } from "../components/reports/hook"
import { useState } from "react"
import LoadingSpinner from "../components/ui/loading"
import { useLocation } from "react-router-dom";



export default function Reports() {
    const location = useLocation();
    const browseStateFromNav = location.state?.user_nickname || "browse";

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [browse, setBrowse] = useState(browseStateFromNav)

    const { data, isLoading, isError, error, isFetching } = useReports({
    search,
    page,
    pageSize,
    browse,
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
                            <Button disabled={browse === 'browse'} variant="ghost" size="sm" onClick={() => setBrowse('browse')}>Browse</Button>
                            <Button disabled={browse !== 'browse'} variant="ghost" size="sm" onClick={() => setBrowse('my-reports')}>My Reports</Button>
                        </div>

                        <hr className="my-2" />
                        <div className="mb-5">
                            <BurgerFilterMenu />

                        </div>
                    </div>


                    
                    {/* reports */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                                <div className="col-span-full flex justify-center items-center py-20">
                                    <LoadingSpinner />
                                </div>
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
                                        user_id={report.user_id}
                                        crypto_name={report?.crypto_name}
                                        crypto_logo_url={report?.crypto_logo_url}
                                    />
                                </ul>
                            ))
                        )}
                    </div>

                    {/* pagination */}
                    <div className="flex justify-center mt-10 space-x-2">
                        <Button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1 || isFetching}>
                            {Math.max(page - 1, 1)}
                        </Button>

                        <Button variant="ghost" className="cursor-default">{page} of {data?.totalPages}</Button>

                        <Button className="disabled:hidden" onClick={() => setPage((old) => Math.min(old + 1, data?.totalPages))} disabled={page === data?.totalPages || isFetching}>
                            {Math.max(page + 1, data?.totalPages)}
                        </Button>
                    </div>
                </div>
            </section>
    );
}