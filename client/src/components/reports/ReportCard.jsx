import { Globe, CalendarDays, MessageCircle, Eye, User } from 'lucide-react';
import { Button } from '../ui/Button';
import DOMPurify from 'dompurify'


const ReportCard = ({crypto_name, crypto_logo_url, report_title, report_description, user_id, created_at}) => {
  const shortDescription = report_description.length > 100
  ? report_description.slice(0, 150) + "..."
  : report_description;

  const date = new Date(created_at);
  const formatted = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

  
  const safeHTML = DOMPurify.sanitize(shortDescription, {
    USE_PROFILES: { html: true }
  });
  return (
    <li className={`flex flex-col min-w-[250px] min-h-[250px] rounded border p-5 shadow-md transform transition duration-300 md:hover:scale-101 hover:shadow-lg ${user_id ? 'border-green-500' : 'border'}`}>
        <div className="flex justify-between items-center">
          <div className="bg-red-600/15 text-red-700 flex items-center gap-2 p-3 rounded-xl">
            <span className="text-sm font-bold">{crypto_name ? (crypto_name) : 'WEB'}</span>
            {crypto_name ?  (<img src={crypto_logo_url} alt={crypto_name} className="h-6 w-6" />) : (<Globe className="h-6 w-6" />)}
          </div>


        </div>
        
        <div className="mt-5 max-w-full overflow-hidden">
          <h3 className="flex text-2xl tracking-wider font-medium">{report_title}</h3>
          <div className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: safeHTML }} />
        </div>


        <div className="flex justify-between mt-auto">
          <div className="flex gap-1 mt-auto">
            
            <Button variant="ghost"><MessageCircle/> 0</Button>
            <Button variant="ghost"><Eye /> 0</Button>
          </div>

          <Button className="mt-auto" variant="ghost"><CalendarDays/>{formatted}</Button>
          
        </div>
    </li>);
};

export default ReportCard;