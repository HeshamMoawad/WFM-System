import Authintication from '../types/auth'
import { DarkModeType, Language } from '../types/base';

export const AUTH_KEY:string = "Auth"
export const PERM_KEY:string = "Perm"
export const MODE_KEY:string = "Mode"
export const LANG_KEY:string = "Lang"
export const CLIENT_ID_KEY:string = "uniqueID"
export const VERSION_KEY : string = "Version"


export const save = (key:string , obj:Object):any=>{
    localStorage.setItem( key ,JSON.stringify(obj)) 
    return obj
};

export const load = (key:string ,save:()=>Object):any=>{
    const local = localStorage.getItem(key)
    if (typeof local === typeof null ){ // typeof local === typeof undefined || 
        console.log(key,'will generate new')
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


export const saveID = (uniqueID:string)=>{
    return save(CLIENT_ID_KEY,uniqueID) 
};

export const loadID = ():string =>{
    return load(CLIENT_ID_KEY,()=>{return saveID("");})
}

export const saveVersion = (uniqueID:string)=>{
    return save(VERSION_KEY,uniqueID) 
};

export const checkExist = (key:string):string|null =>{
    return  localStorage.getItem(key)
}

export const loadVersion = ():string =>{
    const ver = checkExist(VERSION_KEY)
    if(ver === null ){
        localStorage.setItem(VERSION_KEY,"")
        return ""
    }
    return ver ? ver : "" 
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


export const saveDateFilter = (location:string,date:Date)=>{
    return save(`${location}|Date`,date.toString())
}

export const loadDateFilter = (location:string):Date=>{
    const date =  load(`${location}|Date`,()=>{return saveDateFilter(location,new Date())})
    if (date) {
        return new Date(date)
    }
    return new Date()
}   

export const saveSearchFilter = (location:string,search:object)=>{
    return save(`${location}|Search`,search)
}

export const loadSearchFilter = (location:string)=>{
    const search =  load(`${location}|Search`,()=>{return saveSearchFilter(location,{})})    
    return  search 
}   


export const saveSearchFilterSelect = (location:string,search:string)=>{
    return save(`${location}|Search|Select`,search)
}

export const loadSearchFilterSelect = (location:string)=>{
    const search =  load(`${location}|Search|Select`,()=>{return saveSearchFilterSelect(location,"")})    
    return  search  ? search : ""
}   


// export const saveSelected = (location:string,search:string)=>{
//     return save(`${location}|Select`,search)
// }

// export const loadSelected = (location:string)=>{
//     const selected =  load(`${location}|Select`,()=>{return saveSelected(location,"")})    
//     return  selected  ? selected : ""
// }   

