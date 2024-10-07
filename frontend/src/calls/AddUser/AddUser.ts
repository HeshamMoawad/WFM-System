import { sendRequest } from "../base"
import Swal from "sweetalert2"
import { TRANSLATIONS } from "../../utils/constants"
import { Language } from "../../types/base"


export const onAddUser = (formData:FormData,lang:Language , setUUID:(uuid:string)=>void , setLoading:React.Dispatch<React.SetStateAction<boolean>>) =>{
    setLoading(true)
    sendRequest({url:"api/users/user",method:"POST",data:formData})
        .then(data => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successfully Created User",
                showConfirmButton: false,
                timer: 1000
              })
            setUUID(data.uuid)                
            })
        .catch((error)=>{
            Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Dashboard.Alerts.Arrive.onFaild[lang],
                showConfirmButton: false,
                timer: 1000
              })

        })
        .finally(()=> setLoading(false))

}
