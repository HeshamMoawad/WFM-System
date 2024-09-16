import { useState, type FC, type FormEvent } from 'react';
import Container from '../../layouts/Container/Container';
// import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { parseFormData } from '../../utils/converter';
import DatePicker from 'react-datepicker';


interface CoinChangerFormProps {
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
    // Add your form fields here
}

const CoinChangerForm: FC<CoinChangerFormProps> = ({setRefresh}) => {
    const [loading, setLoading] = useState(false);
    const [date , setDate] = useState(new Date())
    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        const form = parseFormData(e)
        form.set('date', `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
        
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
        <Container className='relative min-w-[300px] w-fit h-[200px]'>

            {
                loading? <LoadingComponent /> : <></>
            }
            <form className='grid grid-cols-3 md:grid-cols-2 items-center mb-3 gap-3 h-[90%] p-1' onSubmit={onSubmit}>

                <label htmlFor="date" className='col-span-1'>Date</label>

                <DatePicker 
                    showIcon
                    name='date' 
                    toggleCalendarOnIconClick
                    showMonthYearPicker 
                    renderMonthContent={ (month, shortMonth, longMonth, day) => {
                        const fullYear = new Date(day).getFullYear();
                        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                        return <span title={tooltipText}>{shortMonth}</span>;
                    }} 
                    
                    dateFormat="MM-yyyy" 
                    className='col-span-2 md:w-full text-center border border-[gray]' 
                    calendarIconClassName='w-8 h-8 fixed p-1'
                    selected={date} 
                    onChange={(date)=>{
                        if(date && setDate) {
                            setDate(date)
                        };
                    }
                    }/>

                <label htmlFor="date" className='col-start-1'>SAR Price</label>
                <input type="text" className='col-span-2' name='egp_to_sar' placeholder="SAR Price"/>

                <button type="submit" className='bg-btns-colors-primary col-span-3 w-2/3 place-self-center rounded-lg'>Save</button>
            
            </form>


        </Container>
    );
}

export default CoinChangerForm;
