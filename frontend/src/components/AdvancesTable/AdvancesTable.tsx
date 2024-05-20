import { useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
// import { useAuth } from '../../hooks/auth';
import useRequest from '../../hooks/calls';
import { Advance } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Table from '../TableCard/Table/Table';
import { convertObjectToArrays, getFullURL } from '../../utils/converter';
import { TRANSLATIONS } from '../../utils/constants';
import {LanguageContext} from '../../contexts/LanguageContext';
// import SelectComponent from '../SelectComponent/SelectComponent';
// import { LanguageContext } from '../../contexts/LanguageContext';

interface AdvancesTableProps {
    userID: string ;
    date:Date;
}   

const AdvancesTable: FC<AdvancesTableProps> = ({date,userID}) => {
    // const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const {data , loading} = useRequest<Advance>({
        url:"api/treasury/advance",
        method:"GET",
        params:{
            user__uuid:userID,
            created_at__date__gte: `${date.getFullYear()}-${date.getMonth()}-25`,
            created_at__date__lte: `${date.getFullYear()}-${date.getMonth()+1}-25`,

        }
    },[userID,date])
    let totalAdvance = 0
    return (
        <Container className={`md:w-2/3 min-h-[250px] h-fit relative pb-2`}>
            {
                loading ? <LoadingComponent/> : <></>
            }
            <span className='text-2xl text-btns-colors-primary'>Advances</span>
            <div className='flex flex-col justify-between items-center'>
                {
                    data ? (<>
                        <Table
                        headers={["user","username","amount","created_at"]}
                        data={convertObjectToArrays(data?.results,[
                            {
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return (
                                    <td className='px-3 py-1'>
                                        <div className='flex justify-center items-center'>
                                            <img src={getFullURL(item.profile.picture)} alt="" className='rounded-full w-[60px] h-[60px]'/>
                                        </div>
                                    </td>
                                    )
                                }
                            },{
                                key:"user",
                                method : (_)=>{
                                    const item = _ as any; 
                                    return item?.username
                                },
                            },{
                                key:"amount",
                                method : (_)=>{
                                    totalAdvance += _ as number;
                                    return <td className='px-3 py-1'>{_}</td>
                                },
                            },{
                                key:"created_at",
                                method : (_)=>new Date(_).toLocaleDateString("en-US",{ day: '2-digit', month: 'short' }),
                            }

                        ])}
                    />
                    <div dir={lang === "en" ? "ltr" : "rtl"} className={`flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                        <label>{TRANSLATIONS.Advance.bottom.total[lang]} : {totalAdvance}</label>
                    </div>

    
                    </>):<></>
                }
            </div>
        </Container>
    );
}

export default AdvancesTable;
