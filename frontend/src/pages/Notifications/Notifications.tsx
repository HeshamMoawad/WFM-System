import { useState, type FC } from 'react';
import NotificationsForm from '../../components/NotificationsForm/NotificationsForm';
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface NotificationsProps {}

const Notifications: FC<NotificationsProps> = () => {
    const {auth} = useAuth()
    const [refresh , setRefresh] = useState(false)
    return (
    <div className='notifications flex flex-col gap-3 items-center'>
        {
            checkPermission(auth,"add_notification")?
            <NotificationsForm setRefresh={setRefresh}/>
            :null
        }
        {
            checkPermission(auth,"view_notification")?
            <NotificationsTable setRefresh={setRefresh}  refresh={refresh}/>
            :null
        }
    </div>
    );
}

export default Notifications;
