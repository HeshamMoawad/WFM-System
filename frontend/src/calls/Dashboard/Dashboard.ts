import { sendRequest } from "../base"
import Swal from "sweetalert2"
import { TRANSLATIONS } from "../../utils/constants"
import { Language } from "../../types/base"








export const onArrive = (lang:Language , setArrive:(arrived_at:string|null)=>void , setLoading:React.Dispatch<React.SetStateAction<boolean>>) =>{
    setLoading(true)
    sendRequest({url:"api/users/arrive",method:"POST"})
        .then(data => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: TRANSLATIONS.Dashboard.Alerts.Arrive.onSuccess[lang],
                showConfirmButton: false,
                timer: 1000
              })
            setArrive(data?.arrived_at)
         })
        .catch((error)=>{
            Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Dashboard.Alerts.Arrive.onFaild[lang],
                showConfirmButton: false,
                timer: 1000
              })

        }).finally(()=>setLoading(false))

}

export const onLeave = (lang:Language ,setLeave:(leaved_at:string|null)=>void , setLoading:React.Dispatch<React.SetStateAction<boolean>>) =>{
    setLoading(true)
    sendRequest({url:"api/users/leave",method:"POST"})
        .then(data => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: TRANSLATIONS.Dashboard.Alerts.Leave.onSuccess[lang],
                showConfirmButton: false,
                timer: 1000
              })
            setLeave(data?.leaved_at)

         })
        .catch((error)=>{
            Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Dashboard.Alerts.Leave.onFaild[lang],
                showConfirmButton: false,
                timer: 1000
              })

        }).finally(()=>setLoading(false))

}