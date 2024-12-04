import { Authintication } from "../../types/auth";


export const checkPagePermission=(user:Authintication,page_index:number,sub:boolean|undefined=undefined):boolean=>{
    if (user.is_superuser){
        return true
    }
    
    return user.permissions.main_pages.includes(page_index) || 
           user.permissions.sub_pages.includes(page_index)
}   

export const checkPermission = (user:Authintication,perm:string):boolean=>{
    if(user.is_superuser) return true
    const perm_splited = perm.split("_")
    return user.permissions.permissions.some(
        (perm,...args)=>perm_splited.every(
            (value,...args)=>perm.includes(value)
        )
    )
}   

export const checkPermissions = (user:Authintication,perms:string[])=>{
    return perms.map((perm,index,arr)=>checkPermission(user,perm)).every((res,index,arr)=>res === true)
}