import  {type FC , useState , useContext, useEffect} from 'react';
import SelectComponent from '../SelectComponent/SelectComponent';
import { onSubmitRequest } from '../../calls/Requests/Requests';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
// import LoadingPage from '../LoadingPage/LoadingPage';
import { useAuth } from '../../hooks/auth';
import Container from '../../layouts/Container/Container';
import DatePicker from 'react-datepicker';
import LoadingPage from '../../pages/LoadingPage/LoadingPage';
import { checkPermission } from '../../utils/permissions/permissions';
// import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';


interface ActionPlanFormProps {
    className?: string;
    // refresh:boolean;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionPlanForm: FC<ActionPlanFormProps> = ({className , setRefresh}) => {
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState<boolean>(false)
    const [date, setDate] = useState(new Date())
    // const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? 
    // {is_active:"True"} : {department__name : auth.department.name , is_active:"True"}
    // useEffect(()=>{
    //     console.log("refreshed")
    // },[])
    return (
        <Container className={`${className}`}>
            {/* {refresh ? <></> : <></> } */}
            {
                loading ? <LoadingPage/> : <></>
            }
            <form action="" method="post" className='grid grid-cols-3 gap-4 h-full' onSubmit={e=>{onSubmitRequest(e,lang,setLoading , setRefresh,"api/commission/action-plan")}}>
                <input type="hidden" name='creator' value={auth.uuid}/>
    
                    <div className='col-span-3 flex flex-row justify-between'>
                        <SelectComponent
                                selectClassName=''
                                LabelName={TRANSLATIONS.User[lang]}
                                url='api/users/user'
                                name='user'
                                config={{
                                    value:"uuid",
                                    label:"username"
                                }}
                                params={{is_active:"True"}}
                            />
                    </div>
                <div className='col-span-3 flex flex-row justify-between'>
                    <label htmlFor="details">{TRANSLATIONS.Request.Date[lang]} </label>
                    {/* <CustomDatePicker name='date' className='' clean required/> */}
                    <DatePicker 
                        showIcon
                        dateFormat="yyyy-MM-dd"
                        name='date' 
                        toggleCalendarOnIconClick 
                        className='md:w-full text-center border border-[gray]' 
                        calendarIconClassName='w-4 h-4 fixed p-1'
                        selected={date} 
                        onChange={(date)=>{
                            if(date && setDate) {
                                setDate(date)
                            };
                        }
                    }/>

                </div>
                <div className='col-span-3 flex flex-row justify-between'>
                    <label htmlFor="deduction_days">{TRANSLATIONS.ActionPlan.Form.deduction_days[lang]} </label>
                    <input type='number'  name="deduction_days" max={30} id="deduction_days" className='w-[20%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' dir={TRANSLATIONS.Direction[lang]} required/>
                </div>
                <div className='col-span-3 flex flex-row justify-between'>
                    <label htmlFor="name">{TRANSLATIONS.ActionPlan.Form.name[lang]} </label>
                    <input type='text'  name="name"  id="name" className='w-[80%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' dir={TRANSLATIONS.Direction[lang]} required/>
                </div>
                <div className='col-span-3 flex flex-row justify-between'>
                    <label htmlFor="description">{TRANSLATIONS.Request.Details[lang]} </label>
                    <textarea  name="description" id="description" className='w-[80%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' dir={TRANSLATIONS.Direction[lang]} required/>
                </div>
                <button type='submit' className='col-span-3 bg-btns-colors-primary rounded-md mb-4 h-9'>{TRANSLATIONS.Request.Submit[lang]}</button>
            </form>
        </Container>


    );
}

export default ActionPlanForm;
