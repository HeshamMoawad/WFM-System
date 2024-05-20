import { useEffect, useState, type FC } from 'react';
import { Department, Project } from '../../types/auth';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import SelectComponent from '../SelectComponent/SelectComponent';
import { sendRequest } from '../../calls/base';
import { Convert } from '../../utils/converter';
import Swal from 'sweetalert2';

interface EditLoginInfoProps {
    uuid: string;
}

const EditLoginInfo: FC<EditLoginInfoProps> = ({uuid}) => {
    const [loading , setLoading] = useState(false);
    const [loginInfo , setLoginInfo] = useState<{
        username: string;
        _password: string;
        first_name: string;
        last_name: string;
        department: string;
        project: string;
        title: string;
        role: string;
        is_active:boolean;
    }|null>(null);
    const [refresh , setRefresh] = useState(false)
    const onChange = (event: any) => {
        setLoginInfo((prev) => {
            if (prev) {
                return {
                   ...prev,
                    [event.target.name]: event.target.value,
                };
            }
            return null;
        });
    };

    useEffect(()=>{
        setLoading(true);
        sendRequest({
            url:`api/users/user`,
            method:"GET",
            params:{uuid}
        })
        .then(data=>{
            setLoginInfo(Convert(data?.results[0],["project","department"]));
        }).catch(error=>{
            setLoginInfo(null)
        })
        .finally(()=>{setLoading(false);});
    },[uuid , refresh])
    return (
    <Container className='w-fit h-fit relative'>
        {
            loading? <LoadingComponent/> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary'>Edit Login Info</h1>
        {
            loginInfo ? (
                <form action="" method="post" className="p-3" onSubmit={(e)=>{
                    e.preventDefault();
                    console.log(loginInfo)
                    setLoading(true);
                    sendRequest({
                        url:`api/users/user`,
                        method:"PUT",
                        params:{uuid},
                        data:JSON.stringify(loginInfo) ,
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
                        .then(data=>{
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Updated Successfully",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        })
                        .catch(error=>{
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "Can't Updated",
                                showConfirmButton: false,
                                timer: 1000
                            })
                        })
                        .finally(() =>{
                            setLoading(false);
                            // setRefresh(prev=>!prev);
                        });
                    
                    }}>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        <label htmlFor="username" >Username</label>
                        <input value={loginInfo.username} onChange={onChange} type="text" name="username" id="username" className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                        <label htmlFor="_password">Password</label>
                        <input value={loginInfo?._password} onChange={onChange} type="text" name="_password" id="password"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>


                        <label htmlFor="first_name" >First Name</label>
                        <input value={loginInfo.first_name} onChange={onChange} type="text" name="first_name" id="first_name" className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                        <label htmlFor="last_name">Last Name</label>
                        <input value={loginInfo?.last_name} onChange={onChange} type="text" name="last_name" id="last_name"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                        
                        
                        <label htmlFor="title">Title</label>
                        <input value={loginInfo.title} onChange={onChange} type="text" name="title" id="title"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                        
                        <SelectComponent<Department> 
                            name="department" 
                            LabelName="Department" 
                            url="api/users/department"
                            selectClassName="col-span-2" 
                            config={{value: "uuid",label:"name"}}
                            selected={[loginInfo.department]}
                            refresh={refresh}
                            setSelection={(uuid:string)=>{
                                setLoginInfo(prev=>{
                                    if(prev){
                                        return {...prev , department:uuid}
                                    }
                                    return null;
                                }   
                                )
                            }}
                        />

                        <SelectComponent<Project>
                            name="project" 
                            LabelName="Project" 
                            url="api/users/project"
                            selectClassName="col-span-2" 
                            config={{value: "uuid",label:"name"}}
                            refresh={refresh}
                            selected={[loginInfo.project]}
                            setSelection={(uuid:string)=>{
                                setLoginInfo(prev=>{
                                    if(prev){
                                        return {...prev , project:uuid}
                                    }
                                    return null;
                                }   
                                )
                            }}

                        />

                        <label htmlFor="role">Role</label>
                        <select name="role" value={loginInfo.role} onChange={(e)=>{
                            setLoginInfo((prev)=>{
                                if (prev){
                                    return {
                                       ...prev,
                                        [e.target.name]: e.target.value,
                                    };
                                }
                                return null;
                            });
                        }} className="w-fit outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg">
                            <option value="AGENT">Agent</option>
                            <option value="MANAGER">Manager</option>
                            <option value="HR">HR</option>
                        </select>
                        <div className='col-span-2 flex gap-28'>
                            <label
                                    htmlFor="is_active"
                                    className="col-span-1 md:col-span-1 "
                                >
                                    Active
                            </label>
                            <input
                                type="checkbox"
                                checked={loginInfo.is_active}
                                onChange={(e) => {
                                    setLoginInfo((prev) => {
                                        if (prev){
                                            return {
                                                ...prev,
                                                [e.target.name]: e.target.checked,
                                            };

                                        }
                                        return null;
                                    });
                                }}
                                name="is_active"
                                id="is_active"
                                className="checked:text-[red] w-fit place-self-center outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg"
                            />

                        </div>
                        <div className="col-span-3 md:col-span-6 flex justify-evenly">
                            <button onClick={(e)=>{e.preventDefault();setRefresh(prev=>!prev)}}  className="bg-btns-colors-secondry w-24 h-7 md:w-36 md:h-10 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-btns-colors-primary w-24 h-7 md:w-36 md:h-10 rounded-lg">update</button>
                        </div>
                    </div>
                </form>
            ):<></>
        }
        
    </Container>
    );
}

export default EditLoginInfo;
