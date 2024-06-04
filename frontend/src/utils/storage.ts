import Authintication , {DefaultAuthintication} from '../types/auth'
import { DarkModeType, Language } from '../types/base';

export const AUTH_KEY:string = "Auth"
export const PERM_KEY:string = "Perm"
export const MODE_KEY:string = "Mode"
export const LANG_KEY:string = "Lang"


export const save = (key:string , obj:Object):any=>{
    localStorage.setItem( key ,JSON.stringify(obj)) 
    return obj
};

export const load = (key:string ,save:()=>Object):any=>{
    const local = localStorage.getItem(key)
    if (typeof local === typeof null ){ // typeof local === typeof undefined || 
        return save()
    }else {
        return JSON.parse(local as string)
    }
}

export const saveLogin = (auth:Authintication)=>{
    return save(AUTH_KEY,auth) 
};

export const loadLogin = ():Authintication =>{
    return load(AUTH_KEY,()=>{return saveLogin({} as Authintication) as Authintication;})
}


export const saveMode = (mode:DarkModeType)=>{
    return save(MODE_KEY,mode) 
};

export const loadMode = ():DarkModeType =>{
    const loadedMode = load(MODE_KEY,()=>{return saveMode(false);})
    if (loadedMode){
        document.body.classList.toggle("dark")
    }
    return loadedMode
}



export const saveLang = (lang:Language)=>{
    return save(LANG_KEY,lang) 
};

export const loadLang = ():Language =>{
    const loadedLang = load(LANG_KEY,()=>{return saveLang('en');})
    return loadedLang
}

