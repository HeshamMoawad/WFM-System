import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import TotalTreasury from '../../components/TotalTreasury/TotalTreasury';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';
import UploadOutcome from '../../components/UploadOutcome/UploadOutcome';
import { checkPermission } from '../../utils/permissions/permissions';



const TreasuryProjects = () => {
    const {auth} = useAuth()
    // const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState(false)
    const [refresh,setRefresh] = useState<boolean>(false);
    const [date,setDate] = useState<Date|null>(null)
    const [projects,setProjects] = useState<Record<string,number>|null>(null)
    useEffect(()=>{
        setLoading(true)
        sendRequest({url:"api/treasury/treasury-projects", method:"GET" , params: date ? {date:`${date.getFullYear()}-${date.getMonth()+1}`} : undefined })
         .then(data => {
            setProjects(data)
          })
          .catch(err => console.error(err))
          .finally(() => {                 
                setLoading(false)
             })

    },[refresh , date])
    return (
        <div className="treasury flex flex-col md:grid md:grid-cols-4 gap-5 place-items-start md:p-3">
            {
                loading ? <LoadingComponent/> : <></>
            }
            <div className="col-span-4 w-full flex justify-center items-center">
                {
                    checkPermission(auth,"view_total_treasury") ? <TotalTreasury setDateOuter={setDate} refresh={refresh} setRefresh={setRefresh}/> : null
                }
            </div>
            <div className="col-span-4 w-full flex flex-col md:grid md:grid-cols-4 gap-4 justify-center ">
                {
                    projects ?
                    Object.keys(projects).map((value,index,arr)=>{
                        return (
                            <Container className='col-span-1 h-28 text-3xl font-bold flex flex-col justify-evenly items-center'>
                                <label htmlFor="" className='block text-primary'>{value}</label>
                                <label htmlFor="" className='block'>{projects[value]}</label>
                            </Container>
                        )
                    })
                    :null
                }
            </div>
            <div className="col-span-4 w-full justify-center items-center">
                {
                    checkPermission(auth,"upload_outcome") ? <UploadOutcome/> : null
                }
            </div>
        </div>
    );
}

export default TreasuryProjects;
