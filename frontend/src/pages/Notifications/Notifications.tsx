import type { FC } from 'react';
import NotificationsForm from '../../components/NotificationsForm/NotificationsForm';
import NotificationsTable from '../../components/NotificationsTable/NotificationsTable';

interface NotificationsProps {}

const Notifications: FC<NotificationsProps> = () => {
    return (
    <div className='notifications flex flex-col gap-3 items-center'>
        <NotificationsForm/>
        <NotificationsTable/>
    </div>
    );
}

export default Notifications;
