import type { FC } from 'react';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import SelectComponent from '../SelectComponent/SelectComponent';
import { User } from '../../types/auth';
import { parseFormData } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';

interface NotificationsFormProps {}

const NotificationsForm: FC<NotificationsFormProps> = () => {
    const {auth} = useAuth()
    return (
    <Container className='relative w-[500px] h-fit'>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Add Notifications</h1>
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
                    title: "Successfully Created Lead",
                    showConfirmButton: false,
                    timer: 1000
                  })
                })
            .catch((error)=>{
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Lead",
                    showConfirmButton: false,
                    timer: 1000
                  })
    
            })
            .finally()
            }}>
            <input type="hidden" name="creator" value={auth.uuid} />
            {/* Notification Fields */}

            <label htmlFor="message">Message </label>
            <textarea dir='rtl' name="message" id="message" className='col-span-2 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'></textarea>


            <SelectComponent<User>
                    name="for_users"
                    LabelName="Send To"
                    url="api/users/user"
                    multiple={true}
                    LabelClassName="col-span-1"
                    selectClassName="col-span-2 w-full rounded-lg overflow-auto"
                    config={{
                        value: "uuid",
                        label: "username",
                        
                    }}
                />

            <label htmlFor="message">DeadLine </label>
            <input type="datetime-local" name="deadline" id="deadline"  className='col-span-2 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'/>

            <button type="submit" className="bg-btns-colors-primary col-span-3 h-[35px] w-2/3 place-self-center rounded-lg">Send</button>


        </form>
    </Container>
    );
}

export default NotificationsForm;
