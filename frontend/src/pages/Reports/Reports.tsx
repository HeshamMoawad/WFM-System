import { useEffect, useState, type FC } from 'react';
import { Project } from '../../types/auth';
import { sendRequest } from '../../calls/base';
import LoadingPage from '../LoadingPage/LoadingPage';
import { Link } from 'react-router-dom';

interface ReportsProps {}

const Reports: FC<ReportsProps> = () => {
    const [projects,setProjects] = useState<Project[]>([])
    const [loading,setLoading] = useState<boolean>(false)
    useEffect(()=>{
        setLoading(true)
        sendRequest({url:"api/users/project" , method:"GET"})
        .then((data)=>{
            setProjects(data.results)
        })
        .finally(()=>{
           setLoading(false) 
        })
    },[])
    return (
    <div className='mt-10'>
        {
            loading ? <LoadingPage/> : 
            <>
                <h1 className='text-center text-3xl font-bold'>Reports</h1>
                {/* Add your reports here */}
                <div className='grid grid-cols-12 mt-10 gap-8 p-10 justify-center place-items-center'>
                {
                    projects.map((project,index)=>project.name !== "All" ? (
                        <Link className='col-span-4 w-[300px] text-center rounded-xl text-2xl' to={`/project-report/${project.uuid}`}>
                            <button className='transition-all duration-500 hover:rotate-3 hover:bg-btns-colors-primary border hover:border-[gold] shadow-lg h-8 text-2xl text-center w-40 md:h-14 rounded-lg'>{project.name}</button>
                            </Link>
                    ):null
                )
                }
                </div>
            
            </>
        }

    </div>
    );
}

export default Reports;
