import {  ReactElement, SetStateAction, type FC } from 'react';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
// import {Department} from '../../types/auth';

interface SelectComponentProps {
    name:string;
    LabelName:string;
    url:string;
    selectClassName?:string;
    LabelClassName?:string;
    multiple?:boolean;
    config:{
        value:string;
        label:string|string[];
    }
    selected?:string[]
    setSelection?:React.Dispatch<SetStateAction<any>>;
    moreOptions?:{label:string , value:string}[]
    refresh?:boolean;
}


function SelectComponent<ValuesType>({name,LabelName,url,selectClassName , LabelClassName , refresh , multiple,setSelection ,moreOptions, config={value:"uuid",label:"name"} , selected=[] }:SelectComponentProps):ReactElement {
    // const depend = refresh ? [refresh] : [];
    const {data , loading } = useRequest<ValuesType>({
        method:"GET",
        url,
    }, [refresh])
    return (
    <>
        {
            loading ? <LoadingComponent/> : null
        }
        <label htmlFor={name} className={`${LabelClassName}`}>{LabelName}</label>
        <select onChange={(e)=>setSelection?setSelection(e.currentTarget.value) : null} multiple={multiple} name={name} className={`${selectClassName}`}>
            {
                moreOptions?.map((_,index) => {
                    return (
                        <option key={index} value={_.value}>{_.label}</option>
                    )
                })
            }
            {
                data?.results?.map((_,index) => {
                    const item = _ as any;
                    return (
                        <option key={index} value={item[config.value]} selected={selected.includes(item[config.value])}>{
                            typeof config.label === "string"? item[config.label] : `${config.label.map((value) =>` ${item[value]} `)}`
                            
                            }</option>
                    )
                })
            }

        </select>
    </>
    );
}

export default SelectComponent;
