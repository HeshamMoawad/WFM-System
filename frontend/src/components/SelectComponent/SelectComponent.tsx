import {  ReactElement, SetStateAction, type FC } from 'react';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { getArgsFrom } from '../../utils/converter';
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
        method?:undefined|Function;
    }
    selected?:string[]
    setSelection?:React.Dispatch<SetStateAction<any>>;
    moreOptions?:{label:string , value:string}[]
    refresh?:boolean;
    required?:boolean;
}


function SelectComponent<ValuesType>({name,LabelName,url,selectClassName , LabelClassName , refresh , multiple,setSelection ,moreOptions, config={value:"uuid",label:"name" , method:undefined} , selected=[] , required=false }:SelectComponentProps):ReactElement {
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
        <select onChange={(e)=>setSelection?setSelection(e.currentTarget.value) : null} multiple={multiple} name={name} className={`${selectClassName}`} required={required}>
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
                    const row_text = config.method ? 
                        config.method(...getArgsFrom(item,config.label)) : 
                        typeof config.label === "string"? item[config.label] : `${config.label.map((value) =>` ${item[value]} `)}`

                    return (
                        <option key={index} value={item[config.value]} selected={selected.includes(item[config.value])}>{
                            row_text
                            }</option>
                    )
                })
            }

        </select>
    </>
    );
}

export default SelectComponent;
