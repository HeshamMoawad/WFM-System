import React, { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import SelectComponent from '../SelectComponent/SelectComponent';
// import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Swal from 'sweetalert2';

interface AdvanceFormProps {
    setRefresh?:React.Dispatch<React.SetStateAction<boolean>>
}

const AdvanceForm: FC<AdvanceFormProps> = ({setRefresh}) => {
    const {auth} = useAuth()
    const [loading , setLoading] = useState(false)
    return (
    <Container className='relative w-[40%] h-fit'>
        {
            loading ? <LoadingComponent/>:<></>
        }
        <form action="" method="post" className='flex flex-col gap-4' onSubmit={e=>{
            e.preventDefault();
            setLoading(true);
            sendRequest({method: 'POST',url:"api/treasury/advance",data:parseFormData(e)})
                .then(data=>{
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Successfully",
                            showConfirmButton: false,
                            timer: 1000
                        })
                })
                .catch(error=>{
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Faild to Add",
                            showConfirmButton: false,
                            timer: 1000
                        })
            })
                .finally(()=>{
                    e.currentTarget.reset();
                    setLoading(false)
                    if (setRefresh){
                        setRefresh(prev=>!prev)
                    }
                });

        }}>
                <input type="hidden" name='creator' value={auth.uuid}/>
                <div className='flex flex-row justify-between'>
                    <SelectComponent
                            selectClassName=''
                            LabelName='Taker'
                            url='api/users/user'
                            name='user'
                            config={{
                                value:"uuid",
                                label:"username"
                            }}
                        />
                </div>
                <div className='flex flex-row justify-between'>
                    <label htmlFor="amount">Amount</label>
                    <input type="number" min={10} name="amount" id="amount" className='w-[100%] md:w-[50%]  place-self-center outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' />
                </div>
                <button type='submit' className='bg-btns-colors-primary rounded-md mb-4 h-9'>Submit</button>
            </form>

    </Container>
    );
}

export default AdvanceForm;
