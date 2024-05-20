import  React, {SetStateAction, type FC } from "react";
import {LuEye} from 'react-icons/lu';
import { sendRequest } from "../../../calls/base";
import Swal from "sweetalert2";
import { IoCheckmarkDone } from "react-icons/io5";

interface NotificationCardProps {
    text:string;
    time:string;
    uuid:string;
    setRefresh:React.Dispatch<SetStateAction<boolean>>;
    seen:boolean;
}

const NotificationCard: FC<NotificationCardProps> = ({text , time , uuid , setRefresh , seen}) => {
    const onSeen:React.MouseEventHandler<HTMLButtonElement> = (e)=>{
        e.preventDefault();
        Swal.fire({
            title: "Are you sure you seen it ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Seen it!",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                sendRequest({url:`api/treasury/seen-notification`,method:"POST" , params:{uuid}})
                    .then(data=>{
                        setRefresh(prev=>!prev)
                    })
            } 
          });
            
    }
    return (
        <div className={`${seen ? "opacity-60" :""} flex justify-center items-center min-w-[16rem] md:min-w-[31rem] w-full bg-light-colors-dashboard-primary-bg dark:bg-dark-colors-dashboard-secondry-bg border-r-4 border-primary rounded-lg h-fit px-4 py-2 `}>
            {
                !seen ? <button onClick={onSeen} className="w-1/12 "><LuEye className="w-fit h-6 fill-[transparent] stroke-primary animate-pulse"/></button> :""
            }
            <span className="w-fit md:w-2/12 text-sm text-left text-primary ">
                {time} 
            </span>
            {
                seen ? <IoCheckmarkDone className="w-fit h-6 fill-[transparent] stroke-primary"/> : ""
            }
            
            <p className="w-8/12 md:w-10/12">
                {text}
            </p>
        </div>
    );
};

export default NotificationCard;
