import { Button } from "../components/ui/Button"
import BurgerFilterMenu from "../components/reports/burgerFilterMenu"
import ReportCard from '../components/reports/ReportCard'
import { useReports } from "../components/reports/hook"
import { useState } from "react"
import LoadingSpinner from "../components/ui/loading"
import { useLocation } from "react-router-dom";
import Search from '../components/ui/Search'



export default function Reports() {
    const location = useLocation();
    const token = localStorage.getItem('access_token')

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [browse, setBrowse] = useState({'show': location.state?.showUserReports 
                                        ? 'user' : 'all', 'token': token})

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
                            <div className="flex flex-wrap gap-2">
                              <Button
                                disabled={browse.show === 'all'}
                                variant="ghost"
                                size="sm"
                                onClick={() => setBrowse((old) => ({ ...old, show: 'all' }))}
                              >
                                Browse
                              </Button>
                              {token && (
                                <Button
                                  disabled={browse.show === 'user'}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setBrowse((old) => ({ ...old, show: 'user' }))}
                                >
                                  My Reports
                                </Button>
                              )}
                            </div>
                            
                        </div>

                        <hr className="my-2" />
                        <div className="mb-5 flex items-center gap-2">
                            <BurgerFilterMenu />
                            <Search />

                        </div>
                    </div>


                    
                    {/* reports */}
                    <div className="">
                        {isLoading ? (
                                <div className="col-span-full flex justify-center items-center py-20">
                                    <LoadingSpinner />
                                </div>
                        ) : isError ? (
                            <div>Error: {error.message}</div>
                        ) : (
                            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {data?.reports.map((report) => (
                                <ReportCard
                                  key={report.id}
                                  report_title={report.report_title}
                                  report_description={report.report_description}
                                  created_at={report.created_at}
                                  user_id={report.user_id}
                                  crypto_name={report?.crypto_name}
                                  crypto_logo_url={report?.crypto_logo_url}
                                  website_url={report?.website_url}
                                  crypto_address={report?.crypto_address}
                                />
                              ))}
                            </ul>
                        )}
                    </div>

                    {/* pagination */}
                    {data?.totalPages !== 1 && (
                    <div className="flex justify-center mt-10 space-x-2">
                        <Button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1 || isFetching}>
                            {Math.max(page - 1, 1)}
                        </Button>

                        <Button variant="ghost" className="cursor-default">{page} of {data?.totalPages}</Button>

                        <Button className="disabled:hidden" onClick={() => setPage((old) => Math.min(old + 1, data?.totalPages))} disabled={page === data?.totalPages || isFetching}>
                            {Math.max(page + 1, data?.totalPages)}
                        </Button>
                    </div>
                    )}

                </div>
            </section>
    );
}