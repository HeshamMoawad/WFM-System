import { useState, type FC } from 'react';
import NotificationsForm from '../../components/NotificationsForm/NotificationsForm';
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable';

interface NotificationsProps {}

const Notifications: FC<NotificationsProps> = () => {
    const [refresh , setRefresh] = useState(false)
    return (
    <div className='notifications flex flex-col gap-3 items-center'>
        <NotificationsForm setRefresh={setRefresh}/>
        <NotificationsTable setRefresh={setRefresh}  refresh={refresh}/>
    </div>
    );
}

export default Notifications;
