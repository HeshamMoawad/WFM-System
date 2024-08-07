import { useContext, useState, type FC, type SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import { parseFormData } from '../../utils/converter';
import { onAddUser } from '../../calls/AddUser/AddUser';
import SelectComponent from '../SelectComponent/SelectComponent';
import {  Department, Project } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import {LanguageContext} from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

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
                <label htmlFor="username" className='place-self-center' >{TRANSLATIONS.AddUser.form.username[lang]}</label>
                <input type="text" name="username" id="username" pattern='^[a-z0-9_\-.]+$' className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                <label htmlFor="password_normal"  className='place-self-center' >{TRANSLATIONS.AddUser.form.password[lang]}</label>
                <input type="text" name="password_normal" id="password"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                <label htmlFor="first_name"  className='place-self-center' >{TRANSLATIONS.AddUser.form.first[lang]}</label>
                <input type="text" name="first_name" id="first_name"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                <label htmlFor="last_name"  className='place-self-center' >{TRANSLATIONS.AddUser.form.last[lang]}</label>
                <input type="text" name="last_name" id="last_name"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' required/>
                
                <label htmlFor="title"  className='place-self-center' >{TRANSLATIONS.AddUser.form.usertitle[lang]}</label>
                <input type="text" name="title" id="title"  className='col-span-2 w-[100%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>

                <SelectComponent<Department> 
                    name="department" 
                    LabelName={TRANSLATIONS.AddUser.form.department[lang]}
                    url="api/users/department"
                    selectClassName="col-span-2" 
                    LabelClassName='place-self-center'
                    config={{value: "uuid",label:"name"}}
                    required={true}
                />

                <SelectComponent<Project>
                    name="project" 
                    LabelName={TRANSLATIONS.AddUser.form.project[lang]}
                    url="api/users/project"
                    selectClassName="col-span-2" 
                    LabelClassName='place-self-center'
                    config={{value: "uuid",label:"name"}}
                    required={true}
                />

                <label htmlFor="role" className='place-self-center' >{TRANSLATIONS.AddUser.form.role[lang]}</label>
                <select name="role" className="w-fit text-center outline-none rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg" required>
                    <option value="AGENT">Agent</option>
                    <option value="MANAGER">Manager</option>
                    <option value="HR">HR</option>
                </select>
                
                <section className='col-start-1 col-span-full place-self-center w-[100%] flex flex-row items-center justify-center'>
                    <label htmlFor="crm_username" className='w-1/3 text-center' >{TRANSLATIONS.AddUser.form.crm_username[lang]}</label>
                    <input required type="text" name="crm_username" id="crm_username" className='place-content-center w-1/3 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>
                </section>

                <div className="col-span-3 md:col-span-6 flex justify-evenly">
                    <button onClick={e=>{e.preventDefault();}} className="bg-btns-colors-secondry w-24 h-7 md:w-36 md:h-10 rounded-lg">{TRANSLATIONS.AddUser.form.cancel[lang]}</button>
                    <button type="submit" className="bg-btns-colors-primary w-24 h-7 md:w-36 md:h-10 rounded-lg">{TRANSLATIONS.AddUser.form.create[lang]}</button>
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
