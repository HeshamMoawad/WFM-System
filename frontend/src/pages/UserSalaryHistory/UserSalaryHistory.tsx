import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import MySalaryList from '../MySalaryList/MySalaryList';
import { User } from '../../types/auth';
import Container from '../../layouts/Container/Container';
import { sendRequest } from '../../calls/base';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface UserSalaryHistoryProps {}

const UserSalaryHistory: FC<UserSalaryHistoryProps> = () => {
    const {auth} = useAuth()
    const {user_uuid} = useParams()
    const [user,setUser] = useState<User|undefined>(undefined)
    
    useEffect(()=>{
        sendRequest({url:"api/users/user",method:"GET",params:{uuid:user_uuid}})
            .then((data)=>setUser(data?.results[0]))
            .catch((err)=>{
                console.error(err)
            })
    },[])
    return checkPermission(auth,"view_commission") ? (
        <div className='p-2 mt-2 flex flex-col gap-3'>
        {
            user ? (        
            <Container className='w-fit m-auto p-2 flex flex-row gap-6 text-2xl items-center'>  
                <div className='flex flex-col gap-5'>
                    <label htmlFor="">Username : {user?.username}</label>
                    <label htmlFor="">Department : {user?.department.name}</label>
                    <label htmlFor="">Project : {user?.project.name}</label>
                    <label htmlFor="">Title : {user?.title}</label>
                    <label htmlFor="">Role : {user?.role}</label>
            
                </div>            
                {
                    user.profile?.picture ? (
                    <div className=' w-60 h-60 rounded-lg overflow-hidden justify-center items-center flex'>
                        <img className='w-full h-full' src={user.profile.picture} alt="Profile Pic" />
                    </div>  )
                    : null

                }
            </Container>
        ) : null
        }
        <MySalaryList  user_uuid={user_uuid}/>
    </div>) : null;
}

export default UserSalaryHistory;
