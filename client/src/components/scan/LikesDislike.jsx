import {ThumbsUp , ThumbsDown } from 'lucide-react'
import { Button } from "../ui/Button.jsx"

function LikeDislike() {
   return (
       <div className="flex flex-col border rounded-xl bg-background/60 p-4 gap-3 justify-center items-center">
           <p className="text-sm font-medium">Community score</p>

           <div>
               <Button variant="ghost"><ThumbsUp className="text-success"/>0</Button>
               <Button variant="ghost"><ThumbsDown className="text-destructive" />0</Button>
           </div>
       </div>
   )
}

export default LikeDislike;