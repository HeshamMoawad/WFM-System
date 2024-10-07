import  {type FC , useState , useContext} from 'react';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { onSubmitRequest } from '../../calls/Requests/Requests';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
// import LoadingPage from '../LoadingPage/LoadingPage';
import { useAuth } from '../../hooks/auth';
import Container from '../../layouts/Container/Container';
import DatePicker from 'react-datepicker';
// import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';


interface RequestAddFormProps {
    className?: string;
    refresh:boolean;
    setRefresh:React.Dispatch<React.SetStateAction<boolean>>;
}

const RequestAddForm: FC<RequestAddFormProps> = ({className ,refresh, setRefresh}) => {
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    const [loading , setLoading] = useState<boolean>(false)
    const [date, setDate] = useState(new Date())
    const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? {} : {department__name : auth.department.name}

    return (
        <Container className={`${className}`}>
            {refresh ? <></> : <></> }
            {
                loading ? <LoadingComponent/> : <></>
            }
            <form action="" method="post" className='grid grid-cols-3 gap-4 h-full' onSubmit={e=>{onSubmitRequest(e,lang,setLoading , setRefresh,refresh)}}>
                <input type="hidden" name='user' value={auth.uuid}/>
                <section className="col-span-3 flex flex-row justify-between items-center" dir=''>
                    <label className='inline-block'>{TRANSLATIONS.Request.Type[lang]}</label>
                    <select name='type' className='w-1/3 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg text-center' required>
                        {TRANSLATIONS.Request.Types.map((type__)=>{
                            return <option key={type__.value} value={type__.value}>{type__.translate[lang]}</option>
                        })}
                    </select>
                </section>
                {
                    auth.role === "OWNER" || auth.role === "MANAGER" ?
                    (
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
                                    params={additionalFilter}
                                />
                        </div>
                    ):null
                }
                <div className='col-span-3 flex flex-row justify-between'>
                    <label htmlFor="details">{TRANSLATIONS.Request.Date[lang]} </label>
                    {/* <CustomDatePicker name='date' className='' clean required/> */}
                    <DatePicker 
                        showIcon
                        dateFormat="dd-MM-yyyy"
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
                    <label htmlFor="details">{TRANSLATIONS.Request.Details[lang]} </label>
                    <textarea  name="details" id="details" className='w-[80%] outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg' dir={TRANSLATIONS.Direction[lang]} required/>

                </div>
                <button type='submit' className='col-span-3 bg-btns-colors-primary rounded-md mb-4 h-9'>{TRANSLATIONS.Request.Submit[lang]}</button>
            </form>
        </Container>


    );
}

export default RequestAddForm;
