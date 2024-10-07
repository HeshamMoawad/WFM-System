import { useContext, useState, type FC, type FormEvent } from "react";
import Container from "../../layouts/Container/Container";
import SelectComponent from "../SelectComponent/SelectComponent";
import { sendRequest } from "../../calls/base";
import { parseFormData } from "../../utils/converter";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/auth";
import { LanguageContext } from "../../contexts/LanguageContext";
import { TRANSLATIONS } from "../../utils/constants";

interface AddDevicesFormProps {
    refresh:number,
    setRefresh:React.Dispatch<React.SetStateAction<number>>

}

const AddDevicesForm: FC<AddDevicesFormProps> = ({refresh , setRefresh}) => {
    const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState(false)
    const {auth} = useAuth()
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? {} : {department__name : auth.department.name}

    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        sendRequest({url : "api/users/device-access" , method:"POST" , data:parseFormData(e) })
        .then(response =>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successfully Added Device Access",
                showConfirmButton: false,
                timer: 900
            }).then(()=>setRefresh(Math.random()))

        })
        .catch(err=>{
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Can't Add Device Access",
                showConfirmButton: false,
                timer: 900
            })
        })
        .finally(()=>setLoading(false))
        e.currentTarget.reset()
        
        // .then
    }
    return (
        <Container className="relative w-full md:w-[500px]">
            {
                loading? <LoadingComponent/> : <></>
            }
            <label className="text-center text-xl w-full block">
                {TRANSLATIONS.DeviceAccess.form.title[lang]}
            </label>
            <form className="grid grid-cols-3  space-y-3 items-center mb-4 " onSubmit={onSubmit} >
                <SelectComponent
                    selectClassName="w-11/12 place-self-center"
                    searchClassName="w-2/3"
                    LabelClassName="text-xl col-span-1"
                    LabelName={TRANSLATIONS.DeviceAccess.form.user[lang]}
                    url="api/users/user"
                    name="user"
                    config={{
                        value: "uuid",
                        label: "username",
                    }}
                    params={additionalFilter}
                    required={true}
                    searchOptions={{attr_name:"username__contains"}}
                />
                
                <label htmlFor="name" className="col-span-1">{TRANSLATIONS.DeviceAccess.form.name[lang]}</label>
                <input type="text" className="col-span-2" name="name" id="name" placeholder="Name" required/>
                
                <label htmlFor="unique_id" className="col-span-1">{TRANSLATIONS.DeviceAccess.form.id[lang]}</label>
                <input type="text" name="unique_id" className="col-span-2" id="unique_id" placeholder="ID" required/>
                
                <button type="submit" className="bg-btns-colors-primary rounded-md mb-4 h-9 col-span-3">{TRANSLATIONS.DeviceAccess.form.add[lang]}</button>

            </form>
        </Container>
    );
};

export default AddDevicesForm;
