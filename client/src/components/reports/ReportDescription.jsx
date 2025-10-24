import {useState, useRef, useEffect} from "react";
import {Button} from "../ui/Button.jsx";
import {ChevronUp, ChevronDown  } from 'lucide-react'

function TiptapViewer({ html }) {
    const [isExtended, setIsExtended] = useState(false);
    const BtnRef = useRef(null);

    const handleContainerClick = (e) => {
        if (isExtended) return;
        setIsExtended(!isExtended);
    };


    return (
        <div onClick={handleContainerClick} className="relative">
            <div className={`${isExtended ? '' : 'max-h-[50px] overflow-hidden'} transition ease-out duration-75`} dangerouslySetInnerHTML={{ __html: html }} />

            {/* Дымка сверху вниз, когда текст свернут */}
            {!isExtended && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none transition-opacity duration-300" />
            )}
            {/* Кнопка */}
            <div className="">
                <Button
                    ref={BtnRef}
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExtended(!isExtended)}
                    className="gap-1"
                >
                    {isExtended ? (
                        <>
                            Show less <ChevronUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Show more <ChevronDown className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default TiptapViewer