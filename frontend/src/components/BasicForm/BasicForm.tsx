import { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { parseDateFromParams, parseFormData } from '../../utils/converter';
import { BasicDetails, CommissionDetails } from '../../types/auth';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useNavigate } from 'react-router-dom';

interface BasicFormProps {
    className?: string;
    date: string;
    userCommissionDetails:CommissionDetails ;
    basicDetails?:BasicDetails ,
}

const BasicForm: FC<BasicFormProps> = ({className , userCommissionDetails , date , basicDetails}) => {
    const [loading,setLoading] = useState(false);
    const [basic , setBasic] = useState<BasicDetails>(basicDetails ? basicDetails : {
        deduction_days: 0,
        deduction_money: 0,
        kpi:0,
        gift:0,
        basic:userCommissionDetails.basic,

    } )
    const navigate = useNavigate()
    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setBasic(prev=>{
            const newValues = {
               ...prev,
                [e.target.name] : parseFloat(e.target.value)
            } 
            const val = Number(userCommissionDetails.basic + newValues.gift + newValues.kpi - newValues.deduction_money - (newValues.deduction_days * ( userCommissionDetails.basic/30 ) ) )
            return {
                ...newValues ,
                basic : Math.round(val)
            }
        })
    }
    return (
        <Container className={`${className} relative`}>
            {
                loading? <LoadingComponent/> : <></>
            }
            <form className='grid grid-cols-3 gap-1' onSubmit={e=>{
                e.preventDefault();
                setLoading(true)
                const form = parseFormData(e)
                const date_parsed = parseDateFromParams(date)
                form.append("date",`${date_parsed.getFullYear()}-${date_parsed.getMonth()+1}-${date_parsed.getDate()}`)
                sendRequest({url:"api/commission/basic-details",method:basicDetails ? "PUT" : "POST",data:form, params: basicDetails ? {uuid:basicDetails.uuid} : undefined })
                    .then((data)=>{
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Successfully Gived",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(()=>{
                            navigate("/basic")
                        })
                    }).catch(error =>{
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Faild to Give",
                            showConfirmButton: false,
                            timer: 1000
                        })
                    }).finally(()=>{
                        setLoading(false)
                    })
            }}>
                <label className='text-2xl text-btns-colors-primary place-self-center col-span-3 mb-1'>Basic</label>

                <input type="hidden" name="user_commission_details" value={userCommissionDetails.uuid} />
                {/* <input type="hidden" name="date" value={parseDateFromParams(date)} /> */}

                <label className='col-span-1 place-self-center' htmlFor="deduction_days">Deduction Days</label>
                <input onChange={onChange} className='col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="deduction_days" value={basic.deduction_days}/>


                <label className='col-span-1 place-self-center' htmlFor="deduction_money">Deduction Money</label>
                <input onChange={onChange} className='col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="deduction_money" value={basic.deduction_money}/>


                <label className='col-span-1 place-self-center' htmlFor="kpi">KPI</label>
                <input onChange={onChange} className='col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="kpi" value={basic.kpi}/>


                <label className='col-span-1 place-self-center' htmlFor="gift">Additional Gift</label>
                <input onChange={onChange} className='col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="gift" value={basic.gift}/>


                <label className='col-span-1 place-self-center' htmlFor="basic">Basic</label>
                <input className='col-span-2 place-self-center bg-[transparent] outline-none border-none text-center text-2xl' type="number" name="basic"  value={basic.basic}/>

                <button className='col-span-3 h-8 bg-btns-colors-primary rounded-lg w-2/3 place-self-center my-2' type="submit" >Give</button>
                {
                    basicDetails ? (
                        <button className='col-span-3 h-8 bg-btns-colors-secondry rounded-lg w-2/3 place-self-center my-2' onClick={e=>{
                            e.preventDefault();
                            setLoading(true)
                            sendRequest({url:"api/commission/basic-details",method:"DELETE", params:  {uuid:basicDetails.uuid} })
                            .then((data)=>{
                                
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Successfully Deleted",
                                    showConfirmButton: false,
                                    timer: 1000
                                }).then(()=>{
                                    navigate("/basic")
                                })
                            }).catch(error =>{
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Faild to Delete",
                                    showConfirmButton: false,
                                    timer: 1000
                                })
                            }).finally(()=>{
                                setLoading(false)
                            })
                                }}   >Delete</button>

                    ): null
                }
            </form>
        </Container>
    );
}

export default BasicForm;
