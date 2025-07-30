
type Childrens = React.ReactNode;

type DarkModeType = boolean// "light"|'dark' 

type Language = 'en'|'ar';

type Status = "PENDING" | "REJECTED" | "ACCEPTED"

interface ChildrenType {
    children?: Childrens;
}

interface Base {
    uuid: string;
}

interface PageinationDetails{
    next:string | null;
    previous:string | null;
}

interface PhoneNumber {
    id: string;
    number: string;
    verified: boolean;
  }
  
  interface Account {
    id: string;
    name: string;
    phoneNumbers: PhoneNumber[];
  }
export type {
    ChildrenType ,
    Childrens ,
    DarkModeType ,
    Language ,
    Base , 
    PageinationDetails ,
    Status,
    PhoneNumber,
    Account
}