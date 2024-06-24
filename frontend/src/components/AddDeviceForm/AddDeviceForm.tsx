import { useState, type FC, type FormEvent } from "react";
import Container from "../../layouts/Container/Container";
import SelectComponent from "../SelectComponent/SelectComponent";
import { sendRequest } from "../../calls/base";
import { parseFormData } from "../../utils/converter";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";

interface AddDevicesFormProps {
    refresh:number,
    setRefresh:React.Dispatch<React.SetStateAction<number>>

}

const AddDevicesForm: FC<AddDevicesFormProps> = ({refresh , setRefresh}) => {
    const [loading , setLoading] = useState(false)
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
                Add Device
            </label>
            <form className="grid grid-cols-3 space-y-3 items-center mb-4 " onSubmit={onSubmit} >
                <SelectComponent
                    selectClassName="col-span-2 place-self-center"
                    LabelClassName="text-xl col-span-1"
                    LabelName="User"
                    url="api/users/user"
                    name="user"
                    config={{
                        value: "uuid",
                        label: "username",
                    }}
                    required={true}
                />
                
                <label htmlFor="name" className="col-span-1">Device Name</label>
                <input type="text" className="col-span-2" name="name" id="name" placeholder="Name" required/>
                
                <label htmlFor="unique_id" className="col-span-1">Device ID</label>
                <input type="text" name="unique_id" className="col-span-2" id="unique_id" placeholder="ID" required/>
                
                <button type="submit" className="bg-btns-colors-primary rounded-md mb-4 h-9 col-span-3">Add</button>

            </form>
        </Container>
    );
};

export default AddDevicesForm;
