import { useRef, type FC, useState, SetStateAction } from 'react';
import { IoCalendarOutline} from 'react-icons/io5';



interface DatePickerProps {
    type?: string;
    className?: string;
    setDate?: React.Dispatch<SetStateAction<Date>>;
}

const DatePicker: FC<DatePickerProps> = ({type="date",className,setDate}) => {
    const dateRef = useRef<HTMLInputElement>(null)
    const [currentDate,setCurrentDate] = useState<string|null>(null)
    const handleClick = () => {
        if (dateRef.current) {
            dateRef.current.focus(); // Ensure input is focused
            dateRef.current.showPicker(); // Trigger click event on the input w-64
        }   
    };
    return (
    <div className={`bg-[transparent] border border-[gray] flex flex-row justify-between p-2 rounded-md  rtl:flex-row-reverse ${className}`} id='DatePicker'  onClick={handleClick}>
        <div className='w-fit flex flex-row-reverse justify-center items-center'>
            <input className='invisible' type={type} ref={dateRef} onChange={(e)=>{
                setCurrentDate(e.target.value);
                if (setDate){
                    setDate(new Date(e.target.value)) 
                }
            }}/>
            <IoCalendarOutline className='inline w-full min-w-5'/>
        </div>
        <span>{currentDate}</span>
    </div>
    );
}

export default DatePicker;
