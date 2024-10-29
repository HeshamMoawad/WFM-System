import { useContext, useState, type FC } from 'react';
import {LanguageContext} from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import LateSpeedoMeter from '../../components/LateSpeedoMeter/LateSpeedoMeter';
import AttendanceDetailsTable from '../../components/AttendanceDetailsTable/AttendanceDetailsTable';
import RequestsTableBasic from '../RequestsTableBasic/RequestsTableBasic';

interface AttendanceDetailsProps {}

const AttendanceDetails: FC<AttendanceDetailsProps> = () => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const [userID , setUserID] = useState<string>(auth.uuid);
    const [date , setDate] = useState<Date>(new Date());

    return (
    <div className='attendance-details flex flex-col justify-center items-center'>
        <AttendanceDetailsTable className='md:w-full min-h-[300px]' date={date} setDate={setDate} userID={userID} setUserID={setUserID} label={TRANSLATIONS.AttendanceDetails.title[lang]} />
        <RequestsTableBasic className='md:col-span-7 w-2/3 md:col-start-4 place-self-center'  date={date} user_uuid={userID}/>
        <div className='md:w-2/3 min-h-[300px] h-fit flex flex-col md:flex-row justify-center items-center'>
            <AdvancesTable  date={date} user_uuid={userID}/>
            <LateSpeedoMeter date={date} userID={userID} />
        </div>
        
    </div>
    );
}

export default AttendanceDetails;
