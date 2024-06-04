import  {FormEvent} from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseObject } from '../../utils/converter';
import Swal from 'sweetalert2';
import { saveLogin } from '../../utils/storage';
import Authintication from '../../types/auth';
import { Language } from '../../types/base';
import { useNavigate } from 'react-router-dom';

export const onSubmitLoginForm = (e:FormEvent , lang:Language , setLoading:React.Dispatch<React.SetStateAction<boolean>> , setAuth:React.Dispatch<React.SetStateAction<Authintication>>) => {
  setLoading(true)
    e.preventDefault()
    sendRequest({url:"api/users/login",method:"POST",params:parseObject(e)})
        .then(data => {
            //  console.log(data)
             setLoading(false)
             if (data){
                setAuth(data)
                saveLogin(data)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: TRANSLATIONS.Login.Alerts.onSuccess[lang],
                    text:`${data?.username} -- ${data?.title}` ,
                    showConfirmButton: false,
                    timer: 1000
                  }).then(()=>{
                    if (window.location.pathname === "/login"){
                      window.location.href = '/dashboard'
                    }
                  });           
             }else {
              throw new Error("Please try again")
             }
             
         })
         .catch(err => {
              console.log(err)
              setLoading(false)
              Swal.fire({
                icon: "error",
                title: TRANSLATIONS.Login.Alerts.onFaild[lang],
                showConfirmButton: false,
                timer: 1000
              });
            })
}



export const onForgetPassword = (lang:Language , setLoading:React.Dispatch<React.SetStateAction<boolean>>)=>{
    setLoading(true)
    const form = new FormData();

    form.append("username","");

    Swal.fire({
        icon: "info",
        title: TRANSLATIONS.Login.Alerts.onFaild[lang],
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Send",
        showLoaderOnConfirm: true,
        preConfirm: async (username_) => {
            try {
              const response = await sendRequest({url:"api/users/send_password",method:"POST",params:{"username":username_}});
              if (response) {
                return Swal.showValidationMessage(`
                  ${JSON.stringify(await response.json())}
                `);
              }
              setLoading(false)
              return response.json();

            } catch (error) {
              Swal.showValidationMessage(`
                Request failed: ${error}
              `);
              setLoading(false)

            }
          },
        
      }).then(() => {setLoading(false)});
    
}