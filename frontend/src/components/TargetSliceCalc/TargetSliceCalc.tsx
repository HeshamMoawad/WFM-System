import { useContext, useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import useRequest from '../../hooks/calls';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Table from '../Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import { TargetSlice } from '../../types/auth';
import { calc_target_from_array } from '../../utils/calculator';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface TargetSliceCalcProps {
    uuid:string;
    params?:object;
    name?:string;
    url?:string;
    target?:number;
    className?:string;
    coinChange?:{
        egp_to_sar:number,
        date: string,
    }
}

const TargetSliceCalc: FC<TargetSliceCalcProps> = ({uuid,target,className ,coinChange={egp_to_sar:1,date:""}, name="Target" , params={} , url="api/commission/targets" }) => {
    const [cost,setCost] = useState(0)
    const {lang} = useContext(LanguageContext)
    const [value, setValue] = useState(target ? target : 0)
    const {data,loading} = useRequest<TargetSlice>({
        url,
        params:{user_uuid:uuid , ...params},
    },[])
    useEffect(()=>{
        if(data?.results){
            setCost(calc_target_from_array(value,data?.results) * coinChange.egp_to_sar)
        }
    },[value , data])
    return (
    <Container className={`${className} relative w-[500px] h-fit ${data ? data.results.length > 0 ? "" :"hidden" : "" }`}>
        {
            loading ? <LoadingComponent/> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{name} {coinChange.egp_to_sar > 1 ? `|| Sar = ${coinChange.egp_to_sar} EGP` : ""}</h1>
        {
            data ? (<>
            <Table 
                headers={TRANSLATIONS.TargetSliceCalc.table.headers[lang]}
                className='w-full my-3'
                data={convertObjectToArrays(data?.results,[
                    {
                        key:"min_value",
                        method : (_)=> String(_)
                    },{
                        key:"max_value",
                        method : (_)=> String(_)
                    },{
                        key:["money","is_money_percentage"],
                        method : (_)=>{
                            const item = _ as any; 
                            return `${item.money} ${item.is_money_percentage? "%" : "EGP"}`
                        }
                    }
                ])}
                
                />
            <div className='grid grid-cols-7 my-3'>
                <input type="number" value={value} onChange={e=>{
                    setValue(+e.target.value)
                }}  id="" className='text-xl col-span-2 border-[gray] outline-none px-4 rounded-lg border bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                <label htmlFor="" className='col-span-2 text-xl col-start-4 place-self-center'>{TRANSLATIONS.TargetSliceCalc.target[lang]} (EGP)</label>
                <input type="number" value={cost} disabled id="" className='col-span-2 text-xl bg-[transparent] outline-none border-none'/>
            </div>
            
            </>):<></>
        }

    </Container>
    );
}

export default TargetSliceCalc;
