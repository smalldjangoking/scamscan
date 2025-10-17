import {Bot, CircleQuestionMark} from "lucide-react";
import Input from "./Input.jsx";
import {Button} from "./Button.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Tooltip} from "react-tooltip";
import {isValidUrl, removeHttp} from "../../utils/helpers.js";

function SearchAddress({onValue=''}) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchError, setSearchError] = useState(null);

    const handleSubmitSearch = () => {
        if (!search) return setSearchError('search query is required');
        if (search.includes(' ')) return setSearchError('spaces are not allowed');

        setSearchError(null);

        if (isValidUrl(search)) {
            navigate("/scan/website/" + removeHttp(search));
        }
        else {
            navigate("/scan/crypto/" + search);
        }
    }

    useEffect(() => {
        if (onValue) {
            setSearch(onValue)
        }
    }, [onValue])

    return (
        <div className={`${onValue ? 'md:opacity-50 md:hover:opacity-100 md:transition md:duration-300 md:ease-in-out' : ''} bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6`}>
            <CircleQuestionMark size={20} className="scan-help absolute top-5 right-5"/>

            <Input className={`${searchError ? 'border-destructive' : ''}`}
                   label={'Paste a website or crypto address to check'}
                   placeholder={'https:// or 0x...'}
                   value={search}
                   callBack={setSearch}/>
            {searchError ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-destructive">
                    {searchError}
                </p>
            ) : null}
            <div className="flex justify-start items-center gap-4 mt-4">
                <Button onClick={handleSubmitSearch} disabled={search === onValue}>Search</Button>
                <Button variant='ghost'>Scan with <Bot size={20}/></Button>
            </div>
            <Tooltip
                anchorSelect=".scan-help"
                content={`If no results are found, it simply means there’s no information available yet.\nIt doesn’t necessarily indicate anything positive or negative`}
                style={{whiteSpace: 'pre-line'}}
            />
        </div>
    )
}

export default SearchAddress;