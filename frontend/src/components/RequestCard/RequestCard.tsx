import type { EventHandler, FC, SetStateAction } from 'react';
import { RequestType } from '../../types/auth';
import { getFullURL } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { error } from 'console';

interface RequestCardProps {
    request:RequestType;
    refresh:object;
    setRefresh:React.Dispatch<SetStateAction<object>>;

}

const RequestCard: FC<RequestCardProps> = ({request , refresh , setRefresh}) => {
    const created_at = new Date(request.created_at)
    // const updated_at = request.created_at === request.updated_at ? null : new Date(request.updated_at)
    const onAccept = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        const form  = new FormData();
        form.append("status","ACCEPTED")
        form.append("details",request.details)
        form.append("user",request.user.uuid)
        form.append("type",request.type)
        form.append("date",request.date)

        sendRequest({url:"api/users/request",method:"PUT", params: {uuid:request.uuid}, data:form})
            .then(data =>{
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Accepted Successfully",
                    showConfirmButton: false,
                    timer: 1000
                    }).then(() =>setRefresh({data: {}}))

            })
            .catch(error =>{
                Swal.fire({
                    icon: "error",
                    title: "can't Accept",
                    showConfirmButton: false,
                    timer: 1000
                }).then(() =>setRefresh({data: {}}))
            })
        }
    const onReject = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        
        Swal.fire({
            title: "Why you want to reject ??",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            preConfirm: (note) => {
                const form  = new FormData();
                form.append("status","REJECTED")
                form.append("details",request.details)
                form.append("note",note)
                form.append("user",request.user.uuid)
                form.append("type",request.type)
                form.append("date",request.date)
        
                sendRequest({url:"api/users/request",method:"PUT", params: {uuid:request.uuid}, data:form})
                    .then((data)=> Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Rejected Successfully",
                        showConfirmButton: false,
                        timer: 1000
                        }).then(() =>setRefresh({data: {}}))
                    )
                    .catch(error=>Swal.showValidationMessage(`
                    Request failed: ${error}
                `))
            }
        })
        }
    
    return (
        <div className='flex flex-row w-[100%] md:w-full h-fit gap-1 md:gap-6 items-center border-b p-2 rounded-lg shadow-lg md:m-1' id='card'>
                 
            <img className={`rounded-full  w-[50px] h-[50px] md:w-[65px] md:h-[65px] ${request?.user?.profile?.picture ? "":"invisible" }`} src={getFullURL(request.user.profile.picture)} alt=''/>
            <span className={`${request?.user?.profile?.picture ? "w-0 overflow-hidden h-0" : "w-fit"} md:overflow-visible md:w-fit md:h-fit p-2`}>{request?.user?.username}</span>
            <div className='flex flex-col gap-2 w-full' id='card-body'>
                <p id='details'>{request.details}</p>
                <div className='flex flex-row justify-evenly gap-2 md:gap-6' id='btns-container'>
                    <button onClick={onAccept} className='rounded-md bg-btns-colors-primary w-1/3 md:w-1/5 h-[35px]'> Accept </button>
                    <button onClick={onReject} className='rounded-md bg-btns-colors-secondry w-1/3 md:w-1/5 h-[35px]'> Reject </button>
                </div>
                <div className='flex flex-col md:flex-row justify-between w-full opacity-45 text-sm md:text-base'>
                    <span className='block'>Type : {request.type}</span>
                    <span className='block'>Created : {created_at.toLocaleDateString("en-UK",{dateStyle:"medium"})} {created_at.toLocaleTimeString("en-UK",{hour12:true ,hour:"2-digit",minute:"2-digit"})}</span>
                    {/* <span className='block'>Updated : {
                        updated_at  ? `${updated_at.toLocaleDateString("en-UK",{dateStyle:"medium"})} ${updated_at.toLocaleTimeString("en-UK",{hour12:true ,hour:"2-digit",minute:"2-digit"})}` : " - "
                    }</span> */}
                </div>
            </div>
        </div>
    );
}

export default RequestCard;
