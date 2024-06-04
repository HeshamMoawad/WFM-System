import { AUTH_KEY, loadLogin } from "../utils/storage"
import { BASE_URL } from "../utils/constants"
import Swal from "sweetalert2"


export interface sendRequestKwargs {
    url:string,
    method?:"GET"|"POST"|"PUT"|"DELETE",
    params?:{[k:string] : FormDataEntryValue}|object,
    data?:FormData|any,
    headers?:object,
    reloadWhenUnauthorized?:boolean;
}
export const sendRequest = ({url,method,params,data , headers,reloadWhenUnauthorized=true}:sendRequestKwargs)=>{
    return fetch(`${BASE_URL}${url}${params ? "?" + new URLSearchParams(params as Record<string,string>).toString():""}` , {
        method: method,
        body: data , 
        credentials: 'include', // include cookies in the request
        headers: {
            ...headers,
            'Authorization': loadLogin().Authorization,
        }

      }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else if (response.status === 401 && reloadWhenUnauthorized){
            localStorage.removeItem(AUTH_KEY);
            Swal.fire({
                icon: "error",
                text:"الرجاء اعادة تسجيل الدخول",
                showConfirmButton: false,
                timer: 1000
              }).then(() => window.location.reload())
        }else if (!reloadWhenUnauthorized){
            throw new Error(response.statusText)
        }
    });

}
