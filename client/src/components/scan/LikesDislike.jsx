import {ThumbsUp , ThumbsDown } from 'lucide-react'
import { Button } from "../ui/Button.jsx"

function LikeDislike() {
   return (
       <div className="flex flex-col items-center justify-center p-2 border max-w-fit min-w-0">
           <p className="text-muted-foreground">Vote</p>

           <div>
               <Button variant="ghost"><ThumbsUp className="text-success"/>0</Button>
               <Button variant="ghost"><ThumbsDown className="text-destructive" />0</Button>
           </div>
       </div>
   )
}

export default LikeDislike;