import type { FC, SetStateAction } from 'react';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import SelectComponent from '../SelectComponent/SelectComponent';
import { Department, User } from '../../types/auth';
import { parseFormData } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface NotificationsFormProps {
    setRefresh:React.Dispatch<SetStateAction<boolean>>;
}

const NotificationsForm: FC<NotificationsFormProps> = ({setRefresh}) => {
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const [search , setSearch] = useState("")
    return (
    <Container className='relative w-[500px] h-fit'>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.Notification.form.title[lang]}</h1>
        <form action="" className='grid grid-cols-3 gap-4 my-5' onSubmit={e=>{
            e.preventDefault();
            // TODO: send request to save lead
            const form = parseFormData(e)

            const for_users_elm = e.currentTarget.elements.namedItem("for_users") as HTMLSelectElement;
            const commission_rules_values = Array.from(
                for_users_elm.selectedOptions,
                (option) => option.value
            );
            const data = {
                creator:form.get("creator"),
                message:form.get("message"),
                for_users:commission_rules_values,
                deadline : form.get("deadline"),
            }
            form.append("for_users", JSON.stringify(commission_rules_values))
            sendRequest({url:"api/treasury/notifications",method:"POST",data:JSON.stringify(data) , headers:{"Content-Type": "application/json"}})
            .then(data => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Created Notification",
                    showConfirmButton: false,
                    timer: 1000
                  })
                })
            .catch((error)=>{
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Notification",
                    showConfirmButton: false,
                    timer: 1000
                  })

            })
            .finally(()=>{
                setRefresh(prev=>!prev)
            })
            }}>
            <input type="hidden" name="creator" value={auth.uuid} />
            {/* Notification Fields */}

            <label htmlFor="message" className='place-self-center'>{TRANSLATIONS.Notification.form.message[lang]} </label>
            <textarea required dir='rtl' name="message" id="message" className='col-span-2 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'></textarea>
            
            <SelectComponent<Department>
                    name=""
                    LabelName={TRANSLATIONS.AddUser.form.department[lang]}
                    url="api/users/department"
                    LabelClassName="col-span-1 place-self-center"
                    selectClassName="col-span-2 w-full rounded-lg overflow-auto"
                    config={{
                        value: "uuid",
                        label: "name",
                    }}
                    moreOptions={[{
                        label:"All",
                        value:""
                    }]}
                    // required={true}
                    setSelection={setSearch}
                />

            <SelectComponent<User>
                    name="for_users"
                    LabelName={TRANSLATIONS.Notification.form.sendto[lang]}
                    url="api/users/user"
                    multiple={true}
                    LabelClassName="col-span-1 place-self-center"
                    selectClassName="col-span-2 w-full rounded-lg overflow-auto"
                    config={{
                        value: "uuid",
                        label: "username",
                        
                    }}
                    params={search ? {department__uuid:search} : undefined}
                    required={true}
                />

            <label htmlFor="message" className='place-self-center'>{TRANSLATIONS.Notification.form.deadline[lang]} </label>
            <input required type="datetime-local" name="deadline" id="deadline"  className='col-span-2 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>

            <button type="submit" className="bg-btns-colors-primary col-span-3 h-[35px] w-2/3 place-self-center rounded-lg">{TRANSLATIONS.Notification.form.send[lang]}</button>


        </form>
    </Container>
    );
}

export default NotificationsForm;
