import  {FormEvent} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData, parseObject } from '../../utils/converter';
import Swal from 'sweetalert2';
import { Language } from '../../types/base';
import { loadID, saveLogin } from '../../utils/storage';



export const onSubmitProfileForm = (e:FormEvent , lang:Language , uuid:string, setLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    const temp_form  = parseFormData(e) 
    console.log( temp_form,  typeof temp_form)
    const picture = temp_form.get('picture') as File
    console.error(temp_form.get("phone") , picture)
    if(picture.size === 0) {
      console.log(picture ,  "Will elete picture")
      temp_form.delete("picture")
    }
    for (let [key, value] of temp_form.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    } 
    console.log("form\n",temp_form)
    const finger = loadID()

      sendRequest({url:"api/users/profile",method:"PUT",params:{"uuid":uuid},data:temp_form})
          .then(data => {
              Swal.fire({
                  position: "center",
                  icon: "success",
                  title: TRANSLATIONS.Profile.Alerts.onSuccessUpdate[lang],
                  text:`${data?.username} - AS - ${data?.role}` ,
                  showConfirmButton: false,
                  timer: 1000
                }).then(() => {
                  sendRequest({url:"api/users/login",method:"POST" , params:{unique_id: finger}})
                    .then(data =>{
                      saveLogin(data)
                      window.location.reload()
                    })
                    .catch(err => {
                          console.error(err)
                        })
                })})
            .catch(err => {
                  Swal.fire({
                    icon: "error",
                    title: TRANSLATIONS.Profile.Alerts.onFaildUpdate[lang],
                    showConfirmButton: false,
                    timer: 1000
                  });
                })
            .finally(() => { 
                  setLoading(false)
                });

      

}


