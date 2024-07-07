import { useContext, useState, type FC } from 'react';
import {LanguageContext} from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import LateSpeedoMeter from '../../components/LateSpeedoMeter/LateSpeedoMeter';
import AttendanceDetailsTable from '../../components/AttendanceDetailsTable/AttendanceDetailsTable';

interface AttendanceDetailsProps {}

const AttendanceDetails: FC<AttendanceDetailsProps> = () => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const [userID , setUserID] = useState<string>(auth.uuid);
    const [date , setDate] = useState<Date>(new Date());

    return (
    <div className='attendance-details flex flex-col justify-center items-center'>
        {/* <TableCard date={date} setDate={setDate} userID={userID} setUserID={setUserID} label={TRANSLATIONS.AttendanceDetails.title[lang]} /> */}
        <AttendanceDetailsTable className='md:w-2/3 min-h-[300px]' date={date} setDate={setDate} userID={userID} setUserID={setUserID} label={TRANSLATIONS.AttendanceDetails.title[lang]} />
        <div className='md:w-2/3 min-h-[300px] h-fit flex flex-col md:flex-row justify-center items-center'>
            <AdvancesTable  date={date} user_uuid={userID}/>
            <LateSpeedoMeter date={date} userID={userID} />
        </div>
        
    </div>
    );
}

export default AttendanceDetails;
