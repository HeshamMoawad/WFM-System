
type Childrens = string | JSX.Element | null | JSX.Element[]

type DarkModeType = boolean// "light"|'dark' 

type Language = 'en'|'ar';

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
export type {
    ChildrenType ,
    Childrens ,
    DarkModeType ,
    Language ,
    Base , 
    PageinationDetails
}