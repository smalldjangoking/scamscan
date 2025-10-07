import { Globe, CalendarDays, MessageCircle, Eye  } from 'lucide-react';
import { Button } from '../ui/Button';


const ReportCard = ({report_title, report_description, created_at}) => {
  return (
    <li className="flex flex-col min-w-[250px] min-h-[250px] rounded border border-green p-5 shadow-md transform transition duration-300 md:hover:scale-101 hover:shadow-lg">
        <div>
            <h3 className="flex text-2xl tracking-wider font-medium">{report_title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{report_description}</p>
        </div>


        <div className="flex justify-between mt-auto">
          <div className="flex gap-2 mt-auto">
            <Button variant="ghost"><CalendarDays/>{created_at}</Button>
            <Button variant="ghost"><MessageCircle/> 0</Button>
            <Button variant="ghost"><Eye /> 0</Button>
          </div>


          <div className="bg-red-600/15 text-red-700 flex items-center gap-2 p-3 rounded-xl">
            <span className="text-sm font-bold">WEB</span>
            <Globe className="h-6 w-6" />
          </div>
        </div>
    </li>);
};

export default ReportCard;