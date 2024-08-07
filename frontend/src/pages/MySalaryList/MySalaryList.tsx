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
                headers={["date" , "basic", "commission" , "salary"]}
                data={convertObjectToArrays(data?.results,[
                    {
                        key:"date",
                        method:null
                    },
                    {
                        key:"basic",
                        method:(_)=>{
                            try {
                                const basic:BasicDetails = _ as any
                                return `${basic.basic}` 

                            }catch {
                                return " 0 "
                            }
                        }
                    },{
                        key:["salary", "basic"],
                        method:(_)=>{
                            const {basic , salary} = _ as any

                            return `${salary - basic.basic}`
                        
                        }
                    },

                    {
                        key:"salary",
                        method:(_)=>{
                            total_money += _ as number
                            return `${_}`
                        }
                    },
            ])}
                />
                <div  className={`flex flex-row min-w-[500px] mb-2 rounded-lg items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
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
