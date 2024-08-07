import { useRef, type FC, useState, SetStateAction } from 'react';
import { IoCalendarOutline} from 'react-icons/io5';



interface DatePickerProps {
    type?: string;
    className?: string;
    spanClassName?: string;
    setDate?: React.Dispatch<SetStateAction<Date>>;
    name?:string;
    clean?: boolean;
    required?:boolean;
}

const DatePicker: FC<DatePickerProps> = ({type="date",className,setDate, spanClassName , clean , required=false , name=undefined}) => {
    const dateRef = useRef<HTMLInputElement>(null)
    const date_temp = new Date()
    const date_string_temp = date_temp.getMonth()+1 > 9 ? `${date_temp.getMonth()+1}` : `0${date_temp.getMonth()+1}`
    const [currentDate,setCurrentDate] = useState<string|null>(clean ? null : `${date_temp.getFullYear()}-${date_string_temp}`)
    const handleClick = () => {
        if (dateRef.current) {
            dateRef.current.focus(); // Ensure input is focused
            dateRef.current.showPicker(); // Trigger click event on the input w-64
        }   
    };
    return (
    <div className={`bg-[transparent] border border-[gray] flex flex-row justify-between p-2 rounded-md  rtl:flex-row-reverse ${className}`} id='DatePicker'  onClick={handleClick}>
        <div className='w-fit flex flex-row-reverse justify-center items-center'>
            <input required={required} name={name} className='invisible' type={type} ref={dateRef} value={currentDate ? currentDate : undefined} onChange={(e)=>{
                setCurrentDate(e.target.value);
                console.log(e.target.value , `${new Date(e.target.value).toLocaleDateString("en-US",{year:'numeric' , month:'numeric'})}`.replace("/","-"));
                if (setDate){
                    setDate(new Date(e.target.value)) 
                }
            }}/>
            <IoCalendarOutline className='inline w-full min-w-5'/>
        </div>
        <span className={spanClassName}>{currentDate}</span>
    </div>
    );
}

export default DatePicker;
