import type { FC } from 'react';
import useRequest from '../../hooks/calls';
import { useAuth } from '../../hooks/auth';
import Table from '../../components/Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import { SalaryType } from '../Salary/Salary';
import Container from '../../layouts/Container/Container';
import { BasicDetails } from '../../types/auth';

interface MySalaryListProps {}

const MySalaryList: FC<MySalaryListProps> = () => {
    const {auth} = useAuth()
    const {data , error} = useRequest<SalaryType>({
        url: 'api/commission/salary',
        method: 'GET',
        params:{
            user__uuid: auth.uuid,
        }
    })
    let total_money = 0
    return (

    <div className='my-salary-list flex justify-center '>
    <Container className='w-[80vw] h-fit ' >
            {
                data? (
            <>
                <Table
                    className='mb-2'
                    headers={["date","( de_days + de_money )","( kpi + gift )","= basic","commission","salary"]}
                    data={convertObjectToArrays(data?.results,[
                    {
                        key:"date",
                        method:null
                    },
                    {
                        key:"basic",
                        method:(_)=>{
                            let r;
                            try {
                                const basic:BasicDetails = _ as any
                                r =  `${basic.deduction_days} days + ${basic.deduction_money} EGP` 
                            }catch {
                                r =  "0 days + 0 EGP"
                            }
                            return <td className='px-3 py-1 text-[red] font-bold'>{r}</td>
                        }
                    },
                    {
                        key:"basic",
                        method:(_)=>{
                            let r;
                            try {
                                const basic:BasicDetails = _ as any
                                r =  `${basic.kpi} EGP + ${basic.gift} EGP` 
                            }catch {
                                r =  "0 EGP + 0 EGP"
                            }
                            return <td className='px-3 py-1 text-[green] font-bold'>{r}</td>
                        }
                    },
                    {
                        key:"basic",
                        method:(_)=>{
                            let r;
                            try {
                                const basic:BasicDetails = _ as any
                                r =  `${basic.basic}` 
                            }catch {
                                r =  "0"
                            }
                            return <td className='px-3 py-1 font-bold text-xl-'>{r}</td>
                        }
                    },                    
                    {
                        key:["salary", "basic"],
                        method:(_)=>{
                            const {basic , salary} = _ as any
                            return <td className='px-3 py-1 text-xl font-bold'>{salary - basic.basic}</td>

                        }
                    },

                    {
                        key:"salary",
                        method:(_)=>{
                            total_money += _ as number
                            return <td className='px-3 py-1 text-2xl font-bold'>{_} EGP</td>
                        }
                    },
            ])}
                />
                <div  className={`flex flex-row min-w-[500px] mb-2 rounded-lg items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label> Count Salaries : {data?.results.length} </label>
                    <label> Total Salaries : {total_money} </label>
                </div>
                </>
                ):null
            }
    </Container>
    </div>
    
);
}

export default MySalaryList;
