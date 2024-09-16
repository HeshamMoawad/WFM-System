import { useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { parseDateFromParams, parseFormData } from '../../utils/converter';
import { BasicDetails, CommissionDetails } from '../../types/auth';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface BasicFormProps {
    className?: string;
    date: string;
    userCommissionDetails:CommissionDetails ;
    basicDetails?:BasicDetails ,
    disabled?: boolean;
    deductionDays?: number;
    deductionMoney?:number;
}

const BasicForm: FC<BasicFormProps> = ({className  , deductionDays ,deductionMoney , userCommissionDetails , date , basicDetails , disabled=false}) => {
    const {lang} = useContext(LanguageContext)
    const [loading,setLoading] = useState(false);
    const [basic , setBasic] = useState<BasicDetails>(basicDetails ? basicDetails : {
        deduction_days: deductionDays ?  deductionDays : 0,
        deduction_money: deductionMoney ?  deductionMoney : 0,
        kpi:0,
        gift:0,
        take_annual:0,
        basic: Math.round(userCommissionDetails.basic - (deductionDays ?  deductionDays * ( userCommissionDetails.basic/30 ) : 0) - (deductionMoney ? deductionMoney : 0)),

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
        <Container className={`${className} relative `} disabled={disabled}>
            {
                loading? <LoadingComponent/> : <></>
            }
            <form className='grid grid-cols-3 gap-x-5 md:gap-1 md:w-full' 
                onSubmit={e=>{
                    e.preventDefault();
                    setLoading(true)
                    const form = parseFormData(e)
                    const date_parsed = parseDateFromParams(date)
                    form.append("date",`${date_parsed.getFullYear()}-${date_parsed.getMonth()+1 > 9 ? date_parsed.getMonth() + 1 : "0"+String(date_parsed.getMonth() + 1) }-${date_parsed.getDate()}`)
                    sendRequest({url:"api/commission/basic-details",method:basicDetails ? "PUT" : "POST",data:form, params: basicDetails ? {uuid:basicDetails.uuid} : undefined })
                        .then((data)=>{
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Successfully Gived",
                                showConfirmButton: false,
                                timer: 1000
                            }).then(()=>{
                                navigate(-1)
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
                <label className='text-2xl text-btns-colors-primary place-self-center col-span-3 mb-1'>{TRANSLATIONS.Basic.title[lang]}</label>
                
                <label className='text-2xl place-self-center col-span-3 mb-1'>{TRANSLATIONS.Basic.annual[lang]} : {userCommissionDetails.user.annual_count}</label>

                <input disabled={disabled} type="hidden" name="user" value={userCommissionDetails.user.uuid} />
                {/* <input type="hidden" name="date" value={parseDateFromParams(date)} /> */}



                <label className='col-span-1 place-self-center' htmlFor="take_annual">{TRANSLATIONS.Basic.form.take_annual[lang]}</label>
                <input disabled={disabled} onChange={onChange} onWheel={e=>{e.preventDefault()}} className='w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" min={0} max={userCommissionDetails.user.annual_count} name="take_annual" value={basic.take_annual}/>

                <label className='col-span-1 place-self-center' htmlFor="deduction_days">{TRANSLATIONS.Basic.form.deductiondays[lang]}</label>
                <input disabled={disabled} onChange={onChange} onWheel={e=>{e.preventDefault()}} className='w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="deduction_days" value={basic.deduction_days}/>


                <label className='col-span-1 place-self-center' htmlFor="deduction_money">{TRANSLATIONS.Basic.form.deductionmoney[lang]}</label>
                <input disabled={disabled} onChange={onChange} className='w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="deduction_money" value={basic.deduction_money}/>


                <label className='col-span-1 place-self-center' htmlFor="kpi">{TRANSLATIONS.Basic.form.kpi[lang]}</label>
                <input disabled={disabled} onChange={onChange} className='w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="kpi" value={basic.kpi}/>


                <label className='col-span-1 place-self-center' htmlFor="gift">{TRANSLATIONS.Basic.form.gift[lang]}</label>
                <input disabled={disabled} onChange={onChange} className='w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg' type="number" name="gift" value={basic.gift}/>


                <label className='col-span-1 place-self-center' htmlFor="basic">{TRANSLATIONS.Basic.title[lang]}</label>
                <input disabled={disabled} className='w-5/6 col-span-2 place-self-center bg-[transparent] outline-none border-none text-center text-2xl' type="number" name="basic"  value={basic.basic}/>
                {
                    !disabled ? 
                    <button className='col-span-3 h-8 bg-btns-colors-primary rounded-lg w-2/3 place-self-center my-2' type="submit" >{TRANSLATIONS.Basic.form.give[lang]}</button>
                    : null
                }
                
                {
                    basicDetails && !disabled ? (
                        <button  className='col-span-3 h-8 bg-btns-colors-secondry rounded-lg w-2/3 place-self-center my-2' onClick={e=>{
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
                                    navigate(-1)
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
                                }}   >{TRANSLATIONS.Delete[lang]}</button>

                    ): null
                }
            </form>
        </Container>
    );
}

export default BasicForm;
