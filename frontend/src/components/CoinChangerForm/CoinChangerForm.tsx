import { useState, type FC, type FormEvent } from 'react';
import Container from '../../layouts/Container/Container';
import DatePicker from '../DatePicker/DatePicker';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { parseFormData } from '../../utils/converter';

interface CoinChangerFormProps {
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
    // Add your form fields here
}

const CoinChangerForm: FC<CoinChangerFormProps> = ({setRefresh}) => {
    const [loading, setLoading] = useState(false);
    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        const form = parseFormData(e)
        const date_parsed = new Date(form.get('date') as any)
        console.log(date_parsed , typeof date_parsed , form.entries())
        form.set('date', `${date_parsed.getFullYear()}-${date_parsed.getMonth()+1}-${date_parsed.getDate()}`)
        
        sendRequest({ url:"api/commission/coin-changer" , method:"POST",data:form})
            .then(response =>{
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully Added Coin Changer",
                    showConfirmButton: false,
                    timer: 900
                }).then(()=>setRefresh(prev=>!prev))

            })
            .catch(err=>{
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Can't Add Coin Changer",
                    showConfirmButton: false,
                    timer: 900
                })
            })
            .finally(()=>{
                setLoading(false)
            })
        e?.currentTarget?.reset();

    }
    return (
        <Container className='relative w-[300px]'>
            {
                loading? <LoadingComponent /> : <></>
            }
            <form className='grid grid-cols-3 items-center mb-3 gap-3' onSubmit={onSubmit}>

                <label htmlFor="date" className='w-fit'>Date</label>
                <DatePicker name='date' className='col-span-2' type="month" />

                <label htmlFor="date">SAR Price</label>
                <input type="text" className='col-span-2' name='egp_to_sar' placeholder="SAR Price"/>

                <button type="submit" className='bg-btns-colors-primary col-span-3 w-2/3 place-self-center rounded-lg'>Save</button>
            
            </form>


        </Container>
    );
}

export default CoinChangerForm;
