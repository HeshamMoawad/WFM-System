import Authintication , {DefaultAuthintication} from '../types/auth'

export const AUTH_KEY:string = "AUTH"
export const PERM_KEY:string = "PERM"





export const saveLogin = (auth:Authintication)=>{
    localStorage.setItem( AUTH_KEY ,JSON.stringify(auth)) 
};

export const loadLogin = ():Authintication =>{
    const local = localStorage.getItem(AUTH_KEY)
    if (typeof local === typeof undefined || typeof local === typeof null ){
        saveLogin(DefaultAuthintication)
        return DefaultAuthintication
    }else {
        return JSON.parse(local as string)
    }
}

