import React, { useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { useAuth } from '../../hooks/auth';
import SelectComponent from '../SelectComponent/SelectComponent';
// import { TRANSLATIONS } from '../../utils/constants';
import { sendRequest } from '../../calls/base';
import { parseFormData } from '../../utils/converter';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Swal from 'sweetalert2';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';

interface AdvanceFormProps {
    setRefresh?:React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

const AdvanceForm: FC<AdvanceFormProps> = ({setRefresh , className}) => {
    const {auth} = useAuth()
    const {lang}= useContext(LanguageContext)
    const [loading , setLoading] = useState(false)
    return (
    <Container className={`relative w-[85%] h-fit ${className}`}>
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
                    try{
                        e.currentTarget.reset();
                    }catch (error){
                        console.error(error)
                    }
                    setLoading(false)
                    if (setRefresh){
                        setRefresh(prev=>!prev)
                    }
                });

        }}>
                <input type="hidden" name='user' value={auth.uuid}/>

                {
                    auth.role !== "OWNER" ? 
                    null : (
                        <>
                        <input type="hidden" name='creator' value={auth.uuid}/>
                        <div className='flex flex-row justify-between'>
                            <SelectComponent
                                    selectClassName=''
                                    LabelName={TRANSLATIONS.Advance.form.taker[lang]}
                                    LabelClassName='place-self-center'
                                    url='api/users/user'
                                    name='user'
                                    config={{
                                        value:"uuid",
                                        label:"username"
                                    }}
                                />
                        </div>
                        </>
    
                        )
                }
                <div className='flex flex-row justify-between gap-2'>
                    <label htmlFor="amount" className='place-self-center'>{TRANSLATIONS.Advance.form.amount[lang]}</label>
                    <input type="number" min={10} name="amount" id="amount" className='w-[100%] md:w-[50%]  place-self-center outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' />
                </div>
                <button type='submit' className='bg-btns-colors-primary rounded-md mb-4 h-9'>{TRANSLATIONS.Advance.form.submit[lang]}</button>
            </form>

    </Container>
    );
}

export default AdvanceForm;
