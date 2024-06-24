
interface Project {
    uuid:string;
    name : string ,
    logo : string
}
interface Department{
        uuid:string,
        name:string ,
    }
interface Profile {
    uuid:string,
    phone:string ,
    picture:string|null,
    telegram_id:number|null,
    about:string|null,
}

interface User {
    uuid:string,
    username:string ,
    project : Project ,
    department : Department ,
    profile : Profile,
    role:string
    title:string ,
    first_name:string ,
    last_name:string ,
    is_superuser:boolean ,
    is_active:boolean ,
    _password?:string,

}
interface Authintication extends User {
    Authorization:string ,
    expire : string
}

interface DeductionRules {
    late_time:string;
    deduction_days:number;
    is_global:boolean;
    department:Department;
}

interface TargetSlice{
    min_value:number;
    max_value:number;
    money:string;
    is_monay_percentage:boolean;
    is_global:boolean;
    department:Department;
}

interface ArrivingLeaving {
    user:string;
    date:string;
    arriving_at:string;
    leaving_at:string;
    deuration_between:number;
    deduction:number;
    late:number;
    departure:number;

}

interface RequestType{
    uuid:string;
    created_at:string;
    updated_at:string;
    user:Authintication;
    details:string;
    type:string;
    note:string;
    department:string;
    status:"PENDING"|"ACCEPTED"|"REJECTED";
}

interface BaseTreasury {
    uuid:string;
    created_at:string;
    updated_at:string;
    creator:Authintication;
    amount:number;
}

interface Advance extends BaseTreasury{
    user:Authintication;
}
interface TreasuryRecord extends BaseTreasury{
    details:string;
}

interface NotificationType {
    uuid:string;
    message:string;
    for_users:string[];
    seen_by_users:string[];
    deadline:string;
    created_at:string;
    updated_at:string;

}

interface Filters {
    project__uuid?: string; 
    department__uuid?: string; 
    role?: string;
}

interface CommissionDetails{
    basic: number;
    set_deduction_rules: boolean;
    deduction_rules: DeductionRules[]|string[];
    set_global_commission_rules: boolean;
    commission_rules: TargetSlice[]|string[];
    will_arrive_at : string;
    will_leave_at : string;
    uuid: string;

}

interface DeviceAccessDetails{
    uuid:string;
    user:User;
    name:string;
    unique_id:string;
    created_at:string;
    updated_at:string;
}

const DefaultAuthintication = {
    uuid:"",
    username:'' ,
    project : {
        uuid:"",
        name:"",
        logo:'' ,
    } ,
    department : {
        uuid:"",
        name:'' ,
    },
    profile : {
        uuid:"",
        phone:"",
        picture:null,
        telegram_id:null,
        about:null,
    },
    role:"",
    title:'' ,
    first_name:'' ,
    last_name:'' ,
    is_superuser:false ,
    is_active:true ,
    Authorization:'' ,
    expire : ''
}


export default Authintication;
export {DefaultAuthintication} ;
export type {
    Department ,
    Project ,
    Profile ,
    Authintication ,
    DeductionRules ,
    TargetSlice,
    ArrivingLeaving ,
    RequestType ,
    Advance ,
    TreasuryRecord , 
    NotificationType , 
    User ,
    Filters ,
    CommissionDetails ,
    DeviceAccessDetails ,
};