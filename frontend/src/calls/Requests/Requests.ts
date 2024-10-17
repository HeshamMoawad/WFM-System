import  {FormEvent} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import Swal from 'sweetalert2';
// import { saveLogin } from '../../utils/storage';
// import Authintication from '../../types/auth';
import { Language } from '../../types/base';
// import { saveLogin } from '../../utils/storage';



export const onSubmitRequest = (e:FormEvent , lang:Language ,  setLoading:React.Dispatch<React.SetStateAction<boolean>> , setRefresh?:React.Dispatch<React.SetStateAction<boolean>> , refresh?: boolean) => {
    setLoading(true)
    e.preventDefault()
    sendRequest({url:"api/users/request",method:"POST",data:parseFormData(e)})
        .then(data => {
             Swal.fire({
                position: "center",
                icon: "success",
                title: TRANSLATIONS.Profile.Alerts.onSuccessCreated[lang],
                text:`${data?.username} - AS - ${data?.title}` ,
                showConfirmButton: false,
                timer: 1000
              })
         })
         .catch(err => {
              Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Profile.Alerts.onFaildCreated[lang],
                text:err.message,
                showConfirmButton: false,
                timer: 1000
              });
            }).finally(() => { 
              setLoading(false)
              if (setRefresh){
                setRefresh(prev=>!prev);
              } 
              
            });
}


