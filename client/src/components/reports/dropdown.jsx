import { Button } from "../ui/Button"
import { useState, useEffect, useRef } from "react"

export default function BurgerFilterMenu({ icon: Icon, iter = [], callback, obj_name, position }) {
  const [filterMenu, setFilterMenu] = useState(false);
  const menuRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setFilterMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function callBackAndClose(i) {
    callback((rest) => ({...rest, [obj_name]: i.id}))
    setFilterMenu(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button onClick={() => setFilterMenu(!filterMenu) } variant="ghost" size="sm" className="p-2 border rounded">
        {Icon && <Icon className="w-5 h-5" />}
      </Button>

      {filterMenu && (
        <ul className={`absolute top-full ${position}-0 mt-2 z-50 bg-primary-foreground p-2 rounded shadow-md flex flex-col min-w-[160px] text-left border`}>
          {iter.map((i) => (
            <li
              key={i.id}
              onClick={() => callBackAndClose(i)}
              className="hover:bg-primary/20 px-4 py-2 text-sm rounded cursor-pointer transition border-b last:border-0"
            >
              {i.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
