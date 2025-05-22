import { useContext, useRef, useState, type FC } from 'react';
import {LanguageContext} from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import LateSpeedoMeter from '../../components/LateSpeedoMeter/LateSpeedoMeter';
import AttendanceDetailsTable from '../../components/AttendanceDetailsTable/AttendanceDetailsTable';
import RequestsTableBasic from '../RequestsTableBasic/RequestsTableBasic';
import { useReactToPrint } from 'react-to-print';
import { checkPermission } from '../../utils/permissions/permissions';

interface AttendanceDetailsProps {}

const AttendanceDetails: FC<AttendanceDetailsProps> = () => {
    const {lang} = useContext(LanguageContext)
    const {auth} = useAuth()
    const [userID , setUserID] = useState<string>(auth.uuid);
    const [date , setDate] = useState<Date>(new Date());
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
    <div className='attendance-details flex flex-col justify-center items-center'>
        {
            checkPermission(auth,"print_arrivingleaving") ? <button onClick={()=>{reactToPrintFn()}} className='bg-primary w-36 rounded-lg h-10 text-2xl'>Print</button> : null
        }
        <div ref={contentRef} className='w-full flex flex-col justify-center items-center'>
            <AttendanceDetailsTable ref={contentRef} className='md:w-full min-h-[300px]' date={date} setDate={setDate} userID={userID} setUserID={setUserID} label={TRANSLATIONS.AttendanceDetails.title[lang]} />
        </div>
        <RequestsTableBasic className='md:col-span-7 w-2/3 md:col-start-4 place-self-center'  date={date} user_uuid={userID}/>
        <div className='md:w-2/3 min-h-[300px] h-fit flex flex-col md:flex-row justify-center items-center'>
            <AdvancesTable  date={date} user_uuid={userID}/>
            <LateSpeedoMeter date={date} userID={userID} /> 
        </div>
        
    </div>
    );
}

export default AttendanceDetails;
