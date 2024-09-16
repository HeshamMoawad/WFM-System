import { useContext, type EventHandler, type FC, type SetStateAction } from 'react';
import { AdvanceType } from '../../types/auth';
import { getFullURL } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/auth';

interface AdvanceCardProps {
    advance:AdvanceType;
    refresh:boolean;
    setRefresh:React.Dispatch<SetStateAction<boolean>>;

}

const AdvanceCard: FC<AdvanceCardProps> = ({advance , refresh , setRefresh}) => {
    const created_at = new Date(advance.created_at)
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    // const updated_at = request.created_at === request.updated_at ? null : new Date(request.updated_at)
    const onAccept = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        const form  = new FormData();
        form.append("status","ACCEPTED")
        form.append("user",advance.user.uuid)
        form.append("creator",auth.uuid)

        sendRequest({url:"api/treasury/advance",method:"PUT", params: {uuid:advance.uuid}, data:form})
            .then(data =>{
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Accepted Successfully",
                    showConfirmButton: false,
                    timer: 1000
                    }).then(() =>setRefresh(prev=>!prev))

            })
            .catch(error =>{
                Swal.fire({
                    icon: "error",
                    title: "can't Accept",
                    showConfirmButton: false,
                    timer: 1000
                }).then(() =>setRefresh(prev=>!prev))
            })
        }
    const onReject = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        
        Swal.fire({
            title: "Why you want to reject ??",
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            preConfirm: (note) => {
                const form  = new FormData();
                form.append("status","REJECTED")
                form.append("user",advance.user.uuid)
                form.append("creator",auth.uuid)
                sendRequest({url:"api/treasury/advance",method:"PUT", params: {uuid:advance.uuid}, data:form})
                    .then((data)=> Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Rejected Successfully",
                        showConfirmButton: false,
                        timer: 1000
                        }).then(() =>setRefresh(prev=>!prev))
                    )
                    
            }
        })
        }
    return (
        <div className='flex flex-row w-[100%] md:w-full h-fit gap-1 md:gap-6 items-center border-b p-2 rounded-lg shadow-lg md:m-1' id='card'>
                 
            <img className={`rounded-full  w-[50px] h-[50px] md:w-[65px] md:h-[65px] ${advance?.user?.profile?.picture ? "":"invisible" }`} src={getFullURL(advance.user.profile.picture)} alt=''/>
            <span className={`${advance?.user?.profile?.picture ? "w-0 overflow-hidden h-0" : "w-fit"} md:overflow-visible md:w-fit md:h-fit p-2`}>{advance?.user?.username}</span>
            <div className='flex flex-col gap-2 w-full' id='card-body'>
                <div className='flex flex-row justify-end gap-2 md:gap-10' id='btns-container'>
                    <label htmlFor="" className='md:w-[250px] text-start text-2xl'>Amount : {advance.amount} EGP</label>
                    <button onClick={onAccept} className='rounded-md bg-btns-colors-primary w-1/3 md:w-1/5 h-[35px]'> Accept </button>
                    <button onClick={onReject} className='rounded-md bg-btns-colors-secondry w-1/3 md:w-1/5 h-[35px]'> Reject </button>
                </div>
                <div className='flex flex-col md:flex-row justify-between w-full opacity-45 text-sm md:text-base'>
                    <span className='block'>Created : {created_at.toLocaleDateString("en-UK",{dateStyle:"medium"})} {created_at.toLocaleTimeString("en-UK",{hour12:true ,hour:"2-digit",minute:"2-digit"})}</span>
                    {/* <span className='block'>Updated : {
                        updated_at  ? `${updated_at.toLocaleDateString("en-UK",{dateStyle:"medium"})} ${updated_at.toLocaleTimeString("en-UK",{hour12:true ,hour:"2-digit",minute:"2-digit"})}` : " - "
                    }</span> */}
                </div>
            </div>
        </div>
    );
}

export default AdvanceCard;
