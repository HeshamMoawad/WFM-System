import type { FC } from 'react';
import Container from '../../layouts/Container/Container';
import SelectComponent from '../SelectComponent/SelectComponent';
import { Project } from '../../types/auth';
import DatePicker from '../DatePicker/DatePicker';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import Swal from 'sweetalert2';

interface LeadFormProps {}

const LeadForm: FC<LeadFormProps> = () => {
    
    return (
    <Container className='md:col-span-3 w-[100%] h-fit relative place-self-center'>
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Add Lead</h1>

        <form action="" className='grid grid-cols-3 gap-5 my-4' onSubmit={e=>{
            e.preventDefault();
            // TODO: send request to save lead
            const form = parseFormData(e)

            sendRequest({url:"api/users/lead",method:"POST",data:form})
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
            <SelectComponent
                        selectClassName="col-span-2 place-self-center"
                        LabelClassName="col-span-1"
                        LabelName="User"
                        url="api/users/user"
                        name="user"
                        config={{
                            value: "uuid",
                            label: "username",
                        }}
                        required={true}
                    />

            <label htmlFor="name" className="col-span-1"> Name </label>
            <input type="text" className="col-span-2" name="name" id="name" placeholder="name"/>

            <label htmlFor="phone" className="col-span-1"> Phone </label>
            <input type="text" className="col-span-2" name="phone" id="phone" placeholder="Phone" required/>
            
            <SelectComponent<Project>
                    name="project" 
                    LabelName="Project" 
                    url="api/users/project"
                    selectClassName="col-span-2 place-self-center"
                    LabelClassName="col-span-1"
                    config={{value: "uuid",label:"name"}}
                    required={true}
                />

            
            {/* <label htmlFor="date" className="col-span-1">Date</label>
            <DatePicker 
                name='date'
                className='col-span-2 w-2/3 place-self-center'
                /> */}
            <button type="submit" className="bg-btns-colors-primary col-span-3 h-[35px] w-2/3 place-self-center rounded-lg">Save</button>

        </form>

    </Container>
    );
}

export default LeadForm;
