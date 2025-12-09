import { useEffect, useState, useRef } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowDown } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from '../ui/Loading'
import { useInfinityCryptoList } from "../../utils/hook"


export default function CryptoDropDownMenu({ value, onChange, error }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const mainContainer = useRef()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.crypto-dropdown') && !event.target.closest('.crypto-dropdown-button')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfinityCryptoList({
        queryWord: searchTerm,
        enabled: menuOpen
    });

    const coins = data?.pages ? data.pages.flat() : [];
    const isMobile = window.innerWidth <= 768;
    const targetContainer = isMobile ? document.body : mainContainer.current;

    return (
        <div className="mt-5 inline-block w-64">
            <Button
                onClick={
                    () => {
                        setMenuOpen(!menuOpen);
                    }
                }
                type="button"
                variant="outline"
                aria-invalid={error ? "true" : "false"}
                className="relative crypto-dropdown-button flex w-full md:w-md items-center justify-between h-9 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus:ring-destructive"
                value={value}
                ref={mainContainer}
            >
                {!value || !value.name ? (
                    <>
                        <span className="truncate text-gray-500">Choose the blockchain...</span>
                        <ArrowDown className={`transition-transform duration-300 ease-in-out ${menuOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <img src={value.image} className="mr-2 h-6 w-6" alt={value.name} />
                            <span className="truncate text-gray-500">{value.name}</span>
                        </div>
                    </>
                )}
            </Button>

            {menuOpen && createPortal(
                <div
                    className={`
                        crypto-dropdown
                        md:mt-2
                        fixed md:absolute
                        inset-0 md:inset-auto md:top-[100%] md:left-0
                        z-[50]
                        w-full md:w-[400px]
                        max-h-screen md:max-h-[70vh]
                        bg-primary-foreground
                        border
                        focus-visible:border-ring
                        dark:border-input
                        `}
                >
                    {/* Search Field && Back button */}
                    <div className="flex md:justify-initial justify-between p-3">
                        <div className="full flex w-full">
                            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="mt-0" />
                        </div>

                        <Button
                            className="flex md:hidden items-center ml-10" onClick={() => setMenuOpen(false)} variant="outline" size="lg"><ArrowLeft />back
                        </Button>
                    </div>

                    {/* Crypto List */}
                    <div
                        id="crypto-scroll"
                        className="overflow-y-auto max-h-screen md:max-h-[500px]"
                    >
                        <InfiniteScroll
                            dataLength={coins.length}
                            next={fetchNextPage}
                            hasMore={hasNextPage}
                            loader={
                                <div className="flex justify-center py-4">
                                    <LoadingSpinner />
                                </div>
                            }
                            scrollableTarget="crypto-scroll"
                        >
                            <ul className="flex flex-col gap-1 px-2 pb-3">
                                {coins.map((coin) => (
                                    <li
                                        key={coin.id}
                                        onClick={() => {
                                            onChange(coin);
                                            setMenuOpen(false);
                                        }}
                                        className="flex rounded-lg px-3 py-2.5 cursor-pointer select-none hover:bg-muted/70 active:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={coin.image}
                                                alt={coin.name}
                                                className="h-8 w-8 rounded-full bg-muted object-contain"
                                            />
                                            <div className="flex flex-col min-w-0 items-start">
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {coin.name}
                                                </span>
                                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    {coin.symbol}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </InfiniteScroll>
                    </div>

                </div>,
                targetContainer
            )}
        </div>
    )
}