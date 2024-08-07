import {  ReactElement, SetStateAction, useState } from 'react';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { getArgsFrom } from '../../utils/converter';
import { useAuth } from '../../hooks/auth';
// import {Department} from '../../types/auth';

interface SelectComponentProps {
    name:string;
    LabelName:string;
    url:string;
    selectClassName?:string;
    LabelClassName?:string;
    searchClassName?:string;
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
    params?:object;
    searchOptions?:{
        attr_name:string;
    }
}


function SelectComponent<ValuesType>({name,LabelName,url,selectClassName ,params, LabelClassName , searchClassName ,searchOptions, refresh , multiple,setSelection ,moreOptions, config={value:"uuid",label:"name" , method:undefined} , selected=[] , required=false }:SelectComponentProps):ReactElement {
    const [search,setSearch] = useState('')
    const {data , loading } = useRequest<ValuesType>({
        method:"GET",
        url,
        params:searchOptions ? {...params,[searchOptions.attr_name]:search} : {...params},
    }, [refresh ,search , params])
    return (
    <>
        {
            loading ? <LoadingComponent/> : null
        }
        <label htmlFor={name} className={`${LabelClassName}`}>{LabelName}</label>
        {
            searchOptions ? (        
            <input type="text" className={searchClassName} placeholder='Search' value={search} onChange={(e)=>{setSearch(e.target.value)}} />
            ) : <></>
        }
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
