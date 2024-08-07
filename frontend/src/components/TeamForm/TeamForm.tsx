import { useContext, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import SelectComponent from '../SelectComponent/SelectComponent';
import { TargetSlice, User } from '../../types/auth';
import { parseFormData } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface TeamFormProps {}

const TeamForm: FC<TeamFormProps> = () => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? {} : { is_superuser:"False" , department__name : auth.department.name}

    return (
    <Container className='md:col-span-2 relative h-fit place-self-center'>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.Teams.form.title[lang]}</h1>
        <form className='grid grid-cols-3 gap-4 my-5' 
        onSubmit={e=>{
            e.preventDefault();
            const form = parseFormData(e)
            // TODO: send request to save team
            const agents_elements = e.currentTarget.elements.namedItem("agents") as HTMLSelectElement;
            const agents_values = Array.from(
                agents_elements.selectedOptions,
                (option) => option.value
            );
            const commission_rules_element = e.currentTarget.elements.namedItem("commission_rules") as HTMLSelectElement;
            const commission_rules_values = Array.from(
                commission_rules_element.selectedOptions,
                (option) => option.value
            );
            const data = {
                name:form.get("name"),
                leader:form.get("leader"),
                agents: agents_values,
                commission_rules: commission_rules_values,
            }
            sendRequest({url:"api/commission/team",method:"POST",data:JSON.stringify(data) , headers:{"Content-Type": "application/json"}})
            .then(data => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Created Team",
                    showConfirmButton: false,
                    timer: 1000
                  })
                })
            .catch((error)=>{
                Swal.fire({
                    icon: "error",
                    title: "Failed to Add Team",
                    showConfirmButton: false,
                    timer: 1000
                  })
    
            })
            .finally()
        }}>
            <label htmlFor="name">{TRANSLATIONS.Teams.form.name[lang]}</label>
            <input type="text" id="name" name="name" className="col-span-2 h-11 text-center" required />
            <SelectComponent<User>
                        selectClassName="w-[100%] place-self-center"
                        searchClassName='w-2/3'
                        LabelClassName="col-span-1"
                        LabelName={TRANSLATIONS.Teams.form.leader[lang]}
                        url="api/users/user"
                        name="leader"
                        config={{
                            value: "uuid",
                            label: "username",
                        }}
                        params={additionalFilter}
                        searchOptions={{attr_name:"username__contains"}}
                        required={true}
                    />
            <SelectComponent<User>
                        selectClassName="col-span-2 h-[210px] place-self-center rounded-lg overflow-auto"
                        LabelClassName="col-span-1"
                        LabelName={TRANSLATIONS.Teams.form.members[lang]}
                        url="api/users/user"
                        name="agents"
                        config={{
                            value: "uuid",
                            label: "username",
                        }}
                        required={true}
                        multiple={true}
                        params={additionalFilter}

                    />
            <SelectComponent<TargetSlice>
                name="commission_rules"
                LabelName={TRANSLATIONS.Teams.form.commission[lang]}
                url="api/commission/target-slices"
                params={{"is_global":"False"}}
                multiple={true}
                LabelClassName="" 
                selectClassName="w-full col-span-2 rounded-lg overflow-auto"
                config={{
                    value: "uuid",
                    label: ["min_value", "max_value" , "money" , "is_money_percentage" , "is_global" , "name"],
                    method:(...args:any[])=> `${args[5]} || ${args[0]} , ${args[1]} , ${args[2]} ${args[3] ? "%" : "EGP" } ${args[4] ? ", Global" :""}`
                }}
            />

            <button type="submit" className="bg-btns-colors-primary col-span-3 h-[35px] w-2/3 place-self-center rounded-lg">{TRANSLATIONS.Teams.form.submit[lang]}</button>
        
        </form>

    </Container>
    );
}

export default TeamForm;
