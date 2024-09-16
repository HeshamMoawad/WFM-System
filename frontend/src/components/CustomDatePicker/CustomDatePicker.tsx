import {  type FC, useState, SetStateAction } from 'react';
import { IoCalendarOutline} from 'react-icons/io5';
import DatePicker from "react-datepicker" ;
// import "react-datepicker/dist/react-datepicker.css";


interface DatePickerProps {
    type?: "date"|"month";
    className?: string;
    spanClassName?: string;
    setDate?: React.Dispatch<SetStateAction<Date>>;
    name?:string;
    clean?: boolean;
    required?:boolean;
}

const CustomDatePicker: FC<DatePickerProps> = ({type="date",className,setDate, spanClassName , clean , required=false , name=undefined}) => {
    const date_temp = new Date()
    const date_string_temp = date_temp.getMonth()+1 > 9 ? `${date_temp.getMonth()+1}` : `0${date_temp.getMonth()+1}`
    const [currentDate,setCurrentDate] = useState<string|null>(clean ? null : `${date_temp.getFullYear()}-${date_string_temp}`)
    // const handleClick = () => {
    //     if (dateRef.current) {
    //         dateRef.current.focus(); // Ensure input is focused
    //         dateRef.current.showPicker(); // Trigger click event on the input w-64
    //     }   
    // };
    return (
        <DatePicker 
            required 
            name={name} 
            className='' 
            // { type === "date" ? show }
            // onChange={(e)=>{
            //     if (e){
            //         console.log(`${e.toLocaleDateString("en-US",{year:'numeric' , month:'numeric'})}`.replace("/","-"))
            //         setCurrentDate(`${e.toLocaleDateString("en-US",{year:'numeric' , month:'numeric'})}`.replace("/","-"));                
            //         if (setDate){
            //         setDate(e) 
            //         }

            //     }
                
                // console.log(e.target.value , `${new Date(e).toLocaleDateString("en-US",{year:'numeric' , month:'numeric'})}`.replace("/","-"));
            // }}
        
        />

    // <div className={`bg-[transparent] border border-[gray] flex flex-row justify-between p-2 rounded-md  rtl:flex-row-reverse ${className}`} id='DatePicker' >
    //     <div className='w-fit flex flex-row-reverse justify-center items-center'>
    //         {/* <input required={required} name={name}  type={type} ref={dateRef} value={currentDate ? currentDate : undefined} /> */}
    //         <IoCalendarOutline className='inline w-full min-w-5'/>
    //     </div>
    //     <span className={spanClassName}>{currentDate}</span>
    // </div>
    );
}

export default CustomDatePicker;
