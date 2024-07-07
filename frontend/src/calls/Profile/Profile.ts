import  {FormEvent} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import Swal from 'sweetalert2';
import { Language } from '../../types/base';
import { saveLogin } from '../../utils/storage';
import { getFingerprint } from '../../utils/fingerprint';



export const onSubmitProfileForm = (e:FormEvent , lang:Language , uuid:string, setLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    e.preventDefault()
    const form  = parseFormData(e)
    const picture = form.get('picture') as File
    console.log(picture.size)
    if(picture.size === 0) {
      console.log(picture ,  "Will elete picture")

      form.delete('picture')
    }
    getFingerprint()
      .then((fingerprint) => {
        sendRequest({url:"api/users/profile",method:"PUT",params:{"uuid":uuid},data:form})
            .then(data => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: TRANSLATIONS.Profile.Alerts.onSuccessUpdate[lang],
                    text:`${data?.username} - AS - ${data?.title}` ,
                    showConfirmButton: false,
                    timer: 1000
                  }).then(() => {
                    sendRequest({url:"api/users/login",method:"POST" , params:{unique_id: fingerprint}})
                      .then(data => saveLogin(data))
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
                  window.location.reload()
                  // navigate("/profile",{replace:true})
                  // const history = new History()
                  // history.go(0)
                });

      })

}


