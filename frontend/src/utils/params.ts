import Authintication from "../types/auth";
import { Perm } from "../types/sidebar";


export function checkPermissions(auth:Authintication ,perms:Perm[]){
    if (auth.is_superuser){
        return true;
    }
    let available = false;
    perms.map((perm)=>{
        if ((auth.role === perm.role || perm.role === "*") && (perm.departments.includes(auth.department.name) || perm.departments.includes("*"))){
            available =  true;
        }
    })
    return available;
}
