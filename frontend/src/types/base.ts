
type Childrens = string | JSX.Element | JSX.Element[]

type DarkModeType = boolean// "light"|'dark' 


interface ChildrenType {
    children?: Childrens;
}


export type {
    ChildrenType ,
    Childrens ,
    DarkModeType ,
}