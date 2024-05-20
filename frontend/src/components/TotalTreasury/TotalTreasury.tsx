import { useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';
import {FaArrowCircleDown , FaArrowCircleUp} from 'react-icons/fa';
import { numbersOptions } from '../../utils/constants';

interface TotalTreasuryProps {
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
interface TotalResponse{
    income: number;
    outcome: number;
    total: number;
} 


const TotalTreasury: FC<TotalTreasuryProps> = ({refresh , setRefresh}) => {
    const [loading , setLoading] = useState(false)
    const [totalInfo , setTotalInfo] = useState<TotalResponse>({total:0 , income:0 , outcome:0 })
    useEffect(()=>{
        setLoading(true)
        sendRequest({url:"api/treasury/total-treasury", method:"GET"})
         .then(data => {
            setTotalInfo(data)
          })
          .catch(err => console.error(err))
          .finally(() => {                 
                setLoading(false)
             })
    },[refresh])
    return (
        <Container className="w-full md:w-2/6 flex flex-col justify-center items-center gap-4 p-3 relative">
            {
                loading ? <LoadingComponent/> : <></>
            }
            <span className={`text-4xl md:text-5xl ${totalInfo?.total > 0 ? 'text-btns-colors-primary' : 'text-btns-colors-secondry'}`}>Total Treasury</span>
            <span className="text-4xl md:text-7xl">
                {totalInfo?.total?.toLocaleString("en-UK",numbersOptions )}
            </span>
            <div className='flex flex-row justify-between w-full'>
                <span className="text-xl md:text-2xl text-btns-colors-secondry text-center"><FaArrowCircleUp className='inline w-7 h-7'/> {totalInfo?.outcome?.toLocaleString("en-UK",numbersOptions)} </span>
                <span className="text-xl md:text-2xl text-btns-colors-primary text-center"> {totalInfo?.income?.toLocaleString("en-UK",numbersOptions)} <FaArrowCircleDown className='inline w-7 h-7'/></span>
            </div>
    </Container>
);
}

export default TotalTreasury;
