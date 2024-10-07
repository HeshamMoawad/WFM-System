import { useEffect, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';

interface TotalLeadsCardProps {
    uuid: string,
    year: number,
    month: number,
    className?:string,
    analytics:TotalLeads
}

export interface TotalLeads{
    total: number,
    plus:number,
    plus_value:number,
    plus_price:number,
    american_leads_price:number,
    teams:{
        name: string,
        total: number,
    }[]
}

const TotalLeadsCard: FC<TotalLeadsCardProps> = ({uuid , year ,className, month , analytics}) => {
    const [data , setData] = useState<TotalLeads|null>(analytics)
    const [loading, setLoading] = useState(false)
    return (
    <Container className={`${className} relative w-[500px] h-fit`} >
        {
            loading ? <LoadingComponent/> : <></>
        }
        <h1 className='text-3xl text-btns-colors-primary text-center w-full'>Leads</h1>

        <section className='grid grid-cols-12 text-lg gap-5 my-3'>
            <div className='col-span-6 place-self-center text-center border-[3px] border-btns-colors-secondry w-full rounded-lg'>
                <label className=''>Plus Price : 1 x {data?.plus_price} EGP</label>
            </div>

            <div className='col-span-6 place-self-center  text-center border-[3px] border-btns-colors-secondry w-full rounded-lg'>
                <label className='col-span-1'>American Price : 1 x {data?.american_leads_price} EGP</label>
            </div>


            <div className='col-span-3 flex flex-col place-self-center text-center border-[3px] border-btns-colors-primary w-full rounded-lg'>
                <label className='col-span-1'>Total Leads</label>
                <label className='col-span-1'>{data?.total}</label>
            </div>
            <div className='col-span-3 flex flex-col place-self-center text-center border-[3px] border-btns-colors-primary w-full rounded-lg'>
                <label className='col-span-1'>Plus +2</label>
                <label className='col-span-1'>{data?.plus}</label>
            </div>

            <div className='col-span-6 flex flex-col place-self-center text-center border-[3px] border-btns-colors-primary w-full rounded-lg'>
                <label className='col-span-1'>Plus +2 </label>
                <label className='col-span-1'>{data?.plus} x {data?.plus_price} = {data?.plus_value} EGP</label>
            </div>
        </section>
        {
            data?.teams?.length && data?.teams?.length > 0 ? (
                <>
                <h1 className='col-span-12 text-3xl text-btns-colors-primary text-center w-full'>Teams</h1>

                <section className='grid grid-cols-12 text-lg gap-5 my-3'>
                    {
                        data.teams.map((team)=>{
                            return (
                                <div className='col-span-12 flex flex-col place-self-center text-center border-[3px] border-btns-colors-primary w-full rounded-lg'>
                                    <label className='col-span-1'>Total Team {team.name}</label>
                                    <label className='col-span-1'>{team.total}</label>
                                </div>
                            )
                        })
                    }

                </section>
                </>
            ):<></>
        }

    </Container> 
    );
}

export default TotalLeadsCard;
