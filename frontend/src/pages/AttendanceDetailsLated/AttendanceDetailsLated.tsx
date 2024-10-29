import { useContext, useState, type FC } from 'react';
import {LanguageContext} from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
// import { useAuth } from '../../hooks/auth';
import AttendanceLatedTable from '../../components/AttendanceLatedTable/AttendanceLatedTable';


interface AttendanceDetailsProps {}

const AttendanceDetails: FC<AttendanceDetailsProps> = () => {
    const {lang} = useContext(LanguageContext)
    // const {auth} = useAuth()
    const [date , setDate] = useState<Date>(new Date());

    return (
    <div className='attendance-details flex flex-col justify-center items-center'>
        <AttendanceLatedTable className=' min-h-[300px]' date={date} setDate={setDate} label={TRANSLATIONS.AttendanceLated.title[lang]} />        
    </div>
    );
}

export default AttendanceDetails;
