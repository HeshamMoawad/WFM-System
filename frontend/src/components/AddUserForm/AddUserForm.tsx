import { useContext, useState, type FC, type SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import { parseFormData } from '../../utils/converter';
import { onAddUser } from '../../calls/AddUser/AddUser';
import SelectComponent from '../SelectComponent/SelectComponent';
import {  Department, Project } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import {LanguageContext} from '../../contexts/LanguageContext';

interface AddUserFormProps {
    setUUID:React.Dispatch<SetStateAction<string|null>>
}

const AddUserForm: FC<AddUserFormProps> = ({setUUID}) => {
    const [loading , setLoading] = useState<boolean>(false)
    const {lang} = useContext(LanguageContext);

    return (
        <Container className="w-[45rem] relative">
        <h1 className="text-2xl md:text-3xl text-center">Add User</h1>

        <form action="" method="post" className="p-3" onSubmit={(e)=>{
            e.preventDefault();
            onAddUser(parseFormData(e),lang,setUUID,setLoading)
        }}>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                <input type="hidden" name="is_active" value="true" />

                <label htmlFor="username" >Username</label>
                <input type="text" name="username" id="username" className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                <label htmlFor="_password">Password</label>
                <input type="text" name="_password" id="password"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>

                <SelectComponent<Department> 
                    name="department" 
                    LabelName="Department" 
                    url="api/users/department"
                    selectClassName="col-span-2" 
                    config={{value: "uuid",label:"name"}}
                    required={true}
                />

                <SelectComponent<Project>
                    name="project" 
                    LabelName="Project" 
                    url="api/users/project"
                    selectClassName="col-span-2" 
                    config={{value: "uuid",label:"name"}}
                    required={true}
                />

                <label htmlFor="role">Role</label>
                <select name="role" className="w-fit text-center outline-none rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg" required>
                    <option value="AGENT">Agent</option>
                    <option value="MANAGER">Manager</option>
                    <option value="HR">HR</option>
                </select>
                
                <div className="col-span-3 md:col-span-6 flex justify-evenly">
                    <button onClick={e=>{e.preventDefault();}} className="bg-btns-colors-secondry w-24 h-7 md:w-36 md:h-10 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-btns-colors-primary w-24 h-7 md:w-36 md:h-10 rounded-lg">Create</button>
                </div>
                
            </div>
        </form>
           <>{
                loading ? <LoadingComponent/> : null
            }</> 
    </Container>
);
}


export default AddUserForm;
