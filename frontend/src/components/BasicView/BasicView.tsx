import { useContext, useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import AttendanceDetailsTable from '../../components/AttendanceDetailsTable/AttendanceDetailsTable';
import { parseDateFromParams } from '../../utils/converter';
import BasicForm from '../../components/BasicForm/BasicForm';
import { BasicDetails, CommissionDetails } from '../../types/auth';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface BasicViewProps {}

const BasicView: FC<BasicViewProps> = () => {
    const {lang} = useContext(LanguageContext);
    const {auth} = useAuth()
    const d = new Date()
    const {user_uuid=auth.uuid,date=`${d.getMonth()+1}-${d.getFullYear()}`} = useParams();
    const [userCommissionDetails,setUserCommissionDetails] = useState<CommissionDetails|null>(null);
    const [basicDetails , setBasicDetails] = useState<BasicDetails|null>(null);
    const [totalMoney, setTotalMoney] = useState<number|null>(null);
    const [totalDays, setTotalDays] = useState<number|null>(null);
    useEffect(()=>{
        const date_parsed = parseDateFromParams(date)
        const commissionPromise = sendRequest({url:"api/commission/user-commission-details",method:"GET",params:{user__uuid:user_uuid}})
        const detailsPromise = sendRequest({url:"api/commission/basic-details",method:"GET",params:{
            user__uuid:user_uuid,
            date__year:date_parsed.getFullYear(),
            date__month:date_parsed.getMonth() + 1,

        }})
        Promise.all([commissionPromise, detailsPromise])
        .then(values=>{
            setUserCommissionDetails(values[0]?.results[0])
            setBasicDetails(values[1]?.results[0])

        })
    },[])
    return (<>
    
        <div className='user-basic grid grid-cols-1 md:grid-cols-10 gap-3 m-1 px-2'>
            {
                 userCommissionDetails && user_uuid && date ? (
                <>
                    <label className='text-2xl md:text-4xl md:col-span-10 text-center'>{TRANSLATIONS.Basic.title[lang]} | {userCommissionDetails.user.first_name} {userCommissionDetails.user.last_name}  ({userCommissionDetails?.user.username}) | {userCommissionDetails.user.project.name} | {date} </label>
                    {
                        basicDetails  || (totalMoney !== null && totalDays !== null )? (
                        <BasicForm deductionMoney={totalMoney ? totalMoney : undefined} deductionDays={totalDays ? totalDays : undefined } className='w-[100%] md:col-span-3 place-self-center' basicDetails={basicDetails ? basicDetails : undefined} date={date} userCommissionDetails={userCommissionDetails} />
                        ): null
                    }
                    {/* <AttendanceDetailsTable setTotal={setTotalDays} className='md:col-span-7 place-self-center' label={TRANSLATIONS.AttendanceDetails.title[lang]} date={parseDateFromParams(date)} userID={user_uuid} withDetails={false}/> */}
                </>
                ) : <LoadingComponent/>
            }
        </div>
    
    </>);
}

export default BasicView;
