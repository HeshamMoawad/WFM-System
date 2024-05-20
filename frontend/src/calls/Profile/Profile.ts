import  {FormEvent} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import Swal from 'sweetalert2';
// import { saveLogin } from '../../utils/storage';
// import Authintication from '../../types/auth';
import { Language } from '../../types/base';
import { saveLogin } from '../../utils/storage';



export const onSubmitProfileForm = (e:FormEvent , lang:Language , uuid:string, setLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    e.preventDefault()
    sendRequest({url:"api/users/profile",method:"PUT",params:{"uuid":uuid},data:parseFormData(e)})
        .then(data => {
             Swal.fire({
                position: "center",
                icon: "success",
                title: TRANSLATIONS.Profile.Alerts.onSuccessUpdate[lang],
                text:`${data?.username} - AS - ${data?.title}` ,
                showConfirmButton: false,
                timer: 1000
              }).then(() => {
                sendRequest({url:"api/users/login",method:"POST"})
                  .then(response => {
                      if (response.status === 200) {
                          return response.json()
                      } else {
                          throw new Error(response.statusText)
                      }
                  })
                  .then(data => {saveLogin(data);window.location.reload()})
                  .catch(err => {
                        console.error(err)
                      })

              })
         })
         .catch(err => {
              Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Profile.Alerts.onFaildUpdate[lang],
                showConfirmButton: false,
                timer: 1000
              });
            }).finally(() => { 
              setLoading(false)
            });
}


