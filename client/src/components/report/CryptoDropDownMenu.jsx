    import { useEffect, useState, useRef, useCallback } from "react";
    import { Button } from "../ui/Button";
    import { Input } from "../ui/Input";
    import { createPortal } from "react-dom";
    import { ArrowLeft, ArrowDown } from 'lucide-react';


    export default function CryptoDropDownMenu({value, onChange, error }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [coins, setCoins] = useState([]);
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

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

    const coinsFiltered = searchTerm
        ? coins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : coins;

    const fetchCoinGecko = async ({ filtering = false, search_word = '' } = {}) => {
        const per_page = 100

        if (fetching) return;

        setFetching(true);

        try {
            let res;
            let data;
            if (filtering) {
                res = await fetch(`https://api.coingecko.com/api/v3/search?query=${search_word}`, {
                    method: 'GET',
                });
                const response = await res.json()
                data = (response.coins || []).map(coin => {
                    const { large, ...rest } = coin;
                    return { image: large, ...rest };
                })
            }
            else {
                res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}`, {
                    method: 'GET',
                });
                data = await res.json();
            }
            
            console.log(data)

            setCoins(prevCoins => {
                const existingNames = new Set(prevCoins.map(c => c.name.toLowerCase()));
                const newUniqueCoins = data.filter(c => !existingNames.has(c.name.toLowerCase()));
                return [...prevCoins, ...newUniqueCoins];
            });

            if (!filtering) {
                setPage((prev) => prev + 1)
            }
            return;
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setFetching(false);
        }
    };

    const observer = useRef(null);
    const setRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchCoinGecko();
            }
        });

        if (node) observer.current.observe(node);
    }, [coins]);

    // Определяем целевой контейнер
    const isMobile = window.innerWidth <= 768;
    const targetContainer = isMobile ? document.body : dropdownRef.current;

    return (
        <div className="mt-5 inline-block w-64">
            <Button
                onClick={
                    () => {
                        setMenuOpen(!menuOpen);

                        if (!menuOpen && coins.length === 0) {
                            fetchCoinGecko();
                        }
                    } 
                }
                type="button"
                variant="outline"
                aria-invalid={error ? "true" : "false"}
                className="relative crypto-dropdown-button flex w-full md:w-md items-center justify-between h-9 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:focus:ring-destructive"
                value={value}
                ref={dropdownRef}
            >
                {!value || !value.name ? (
                    <>
                        <span className="truncate text-gray-500">Choose...</span>
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
               
            {menuOpen && targetContainer && createPortal(
                <div className={`crypto-dropdown md:mt-2 fixed md:absolute inset-0 md:inset-auto md:top-full md:left-0 z-[50] max-h-screen md:max-h-96 md:w-md bg-primary-foreground border focus-visible:border-ring dark:border-input`}>
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
                    <ul className="divide-y overflow-auto max-h-screen md:max-h-96 text-sm">
                        {coinsFiltered.map((coin, index) => (
                            <li ref={index === coins.length - 2 ? setRef : null} key={coin.id || index} onClick={() => {
                                onChange(coin)
                                setMenuOpen(false)
                            }} className="flex cursor-pointer items-center gap-5 p-3">
                                <img src={coin.image} className="h-10 w-10" alt={coin.name} />
                                <p>{coin.name}</p>
                            </li>
                        ))}
                        {searchTerm && (
                            <Button onClick={() => fetchCoinGecko({ filtering: true, search_word: searchTerm })} variant="outline" size="lg" className="flex w-full">Load More</Button>
                        )}

                        {fetching && (
                            <li className="flex justify-center p-3 text-gray-500">
                                Loading...
                            </li>
                        )}
                    </ul>
                </div>, 
                targetContainer
            )}
        </div>
    )
}