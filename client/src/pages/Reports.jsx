import { Button } from "../components/ui/Button"
import BurgerFilterMenu from "../components/reports/dropdown"
import ReportCard from '../components/reports/ReportCard'
import { useReports } from "../utils/hook.js"
import React, { useState, useEffect } from "react"
import LoadingSpinner from "../components/ui/Loading.jsx"
import Input from '../components/ui/Input'
import { Menu, ListFilter, FileWarning } from "lucide-react"
import debounce from 'lodash.debounce';
import Pagination from "../components/ui/Paginator.jsx";
import { Context } from "../main";
import { useContext } from "react"
import SeoHead from "../components/Seo.jsx"

export default function Reports() {
    const { store } = useContext(Context)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterQuery, setFilterQuery] = useState({})
    const [page, setPage] = useState(1)
    const pageSize = 10
    const [userOnly, setUserOnly] = useState(false)
    const user_id = store.userId
    const debounceSearch = React.useMemo(
        () => debounce((val) => setDebouncedSearch(val), 500),
        []
    );


    const { data, isLoading, isError, isFetching } = useReports({
        debouncedSearch,
        page,
        pageSize,
        userOnly,
        filterQuery,
        user_id
    })

    const reportOptions = [
        {
            id: "crypto",
            label: "Crypto Addresses",
        },
        {
            id: "website",
            label: "Websites",
        }
    ];

    const sortBy = [
        { id: "oldest", label: "Oldest first" },
        { id: "comments", label: "Most Comments" },
        { id: "viewed", label: "Most Viewed" },
    ];

    useEffect(() => {
        debounceSearch(search);
        return () => {
            debounceSearch.cancel();
        };
    }, [search, debounceSearch]);


    return (
        <section className="relative">
            <SeoHead
                title="Explore all scam reports"
                description="Browse all community-submitted reports on suspicious crypto wallet addresses, scam websites, and fraudulent blockchain projects on ScamScan.io."
                canonicalUrl="https://scamscan.io/reports"
                robots="index,follow"
                ogType="website"
                ogImage="https://scamscan.io/static/logo.svg"
                twitterCard="summary_large_image"
                twitterImage="https://scamscan.io/static/logo.svg"
                keywords={[
                    "crypto scam reports",
                    "browse scam reports",
                    "crypto address blacklist",
                    "scam website reports",
                    "cryptocurrency fraud database",
                    "user generated scam reports",
                    "blockchain scam intelligence",
                    "crypto due diligence tool",
                    "crypto risk monitoring",
                    "ScamScan reports explorer",
                ]}
            />
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative container mx-auto py-10 px-2 md:py-20 md:max-w-4xl">
                <h2 className="text-4xl font-bold">Reports Explorer</h2>
                <p className="text-muted-foreground max-w-2xl text-lg">
                    A complete list of all reports collected on the platform.
                </p>

                {/* menu */}
                <div className="mt-4">
                    <div className="flex flex gap-2 justify-between">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                disabled={!userOnly}
                                variant="ghost"
                                size="sm"
                                onClick={() => setUserOnly((old) => !old)}
                            >
                                Browse
                            </Button>

                            {store.accessToken && (
                                <Button
                                    disabled={userOnly}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setUserOnly((old) => !old)}
                                >
                                    My Reports
                                </Button>
                            )}
                        </div>

                        <div>
                            {Object.keys(filterQuery).length > 0 && (
                                <div className="flex gap-2 items-center">
                                    <span className="text-muted-foreground max-w-2xl text-sm">Filltred by:</span>
                                    {Object.entries(filterQuery).map(([key, value]) => (
                                        <Button onClick={() => setFilterQuery((rest) => {
                                            const { [key]: _, ...newRest } = rest
                                            return newRest
                                        })} size="sm" variant="destructive" key={key}>{value}</Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="my-2" />
                    <div className="mb-5 flex items-center gap-2">
                        <BurgerFilterMenu icon={Menu} iter={reportOptions} obj_name={'category'}
                            callback={setFilterQuery} position={'left'} />
                        <Input placeholder="Filter..." callBack={setSearch} />
                        <BurgerFilterMenu icon={ListFilter} iter={sortBy} obj_name={'orderby'}
                            callback={setFilterQuery} position={'right'} />
                    </div>
                </div>


                {/* reports */}
                <div className="">
                    {
                        isLoading ? (
                            <div className="col-span-full flex justify-center items-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : isError ? (
                            <div>Error</div>
                        ) : data?.reports?.length > 0 ? (
                            (<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {data?.reports.map((report) => (
                                    <ReportCard
                                        key={report.id}
                                        report_title={report?.report_title}
                                        report_description={report?.report_description}
                                        created_at={report?.created_at}
                                        user_id={report?.user_id}
                                        crypto_name={report?.address.crypto_name}
                                        crypto_logo_url={report?.address.crypto_logo_url}
                                        website_url={report?.address.website_url}
                                        crypto_address={report?.address.crypto_address}
                                        slug={report?.slug}
                                        id={report?.id}
                                    />
                                ))}
                            </ul>)
                        ) : (
                            <div className="flex flex-1 items-center justify-center min-h-[250px]">
                                <div className="text-center">
                                    <div
                                        className="mx-auto mb-4 h-14 w-14 rounded-full border border-dashed flex items-center justify-center">
                                        <FileWarning className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        We couldn’t find anything. Try updating your search or filters
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* pagination */}
                <Pagination
                    page={page}
                    totalPages={data?.totalPages}
                    isFetching={isFetching}
                    onPageChange={setPage}
                />

            </div>
        </section>
    );
}