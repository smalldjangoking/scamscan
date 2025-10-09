export default function Search({placeHolder = 'Filter...'}) {
    return (
        <div className="flex w-full">
            <input 
            placeholder={placeHolder} 
            type="text" 
            className="flex w-full h-full border rounded pl-2" />
        </div>
    )
}