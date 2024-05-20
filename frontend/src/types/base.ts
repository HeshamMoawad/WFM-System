
type Childrens = string | JSX.Element | null | JSX.Element[]

type DarkModeType = boolean// "light"|'dark' 

type Language = 'en'|'ar';

interface ChildrenType {
    children?: Childrens;
}


export type {
    ChildrenType ,
    Childrens ,
    DarkModeType ,
    Language ,
}