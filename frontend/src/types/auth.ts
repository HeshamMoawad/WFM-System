interface Project {
    name : string ,
    logo : string
}

interface Authintication {
    username:string ,
    project : Project ,
    department : {
        name:string ,
    },
    title:string ,
    first_name:string ,
    last_name:string ,
    basic:number ,
    deduction_rules:boolean ,
    Authorization:string ,
    expire : string
}

const DefaultAuthintication = {
    username:'' ,
    project : {
        name:"",
        logo:''
    } ,
    department : {
        name:'' ,
    },
    title:'' ,
    first_name:'' ,
    last_name:'' ,
    basic:0 ,
    deduction_rules:true ,
    Authorization:'' ,
    expire : ''
}


export default Authintication;

export {DefaultAuthintication};