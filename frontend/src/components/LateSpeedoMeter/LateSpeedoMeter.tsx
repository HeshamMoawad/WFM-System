import {  type FC } from 'react';
import Container from '../../layouts/Container/Container';
import ReactSpeedometer from 'react-d3-speedometer';
import useRequest from '../../hooks/calls';
import { ArrivingLeaving } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

interface LateSpeedoMeterProps {
    userID: string;
    date:Date;
    
}

const LateSpeedoMeter: FC<LateSpeedoMeterProps> = ({date,userID}) => {
    
    const {data , loading }  = useRequest<ArrivingLeaving>({
        url:"api/users/arriving-leaving",
        method:"GET",
        params:{
            user__uuid:userID ,
            date__gte: `${date.getFullYear()}-${date.getMonth()}-25`,
            date__lte: `${date.getFullYear()}-${date.getMonth()+1}-25`,
            // date__gte: `${date.getFullYear()}-${date.getMonth()+1}-1`,
            // date__lte: `${date.getFullYear()}-${date.getMonth()+1}-${getLastDayOfMonth(date)}`,
        }
    },[date,userID])

    return (
        <Container className='md:w-fit w-full h-full flex flex-col justify-center relative'>
            {
                loading ? <LoadingComponent/> : <></>
            }
            <div className='flex flex-col gap-6 justify-center items-center h-fit '>
                <h1 className='text-xl'>Late Percentage</h1>
                {
                    data ? (
                        <ReactSpeedometer minValue={0} maxValue={100} value={ data.results.length !== 0 ? Math.floor(((data.results.length - data.results.filter((obj:ArrivingLeaving)=>obj.late > 60 ).length )/data.results.length) *100) : 100} height={210} width={320} segments={4} needleColor='black'/>
                    ) : null
                        // <ReactSpeedometer minValue={0} maxValue={100} value={0} height={210} width={320} segments={4} needleColor='black'/>
                }
            </div>
        </Container>
);
}

export default LateSpeedoMeter;
