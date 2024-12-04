import type { FC } from 'react';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useAuth } from '../../hooks/auth';
import { checkPermission } from '../../utils/permissions/permissions';

interface UsersListProps {}

const UsersList: FC<UsersListProps> = () => {
    const {auth} = useAuth()
    return (
    <div className='users-list flex justify-center'>
        {
            checkPermission(auth,"view_user") ? <UsersTable/> : null
        }
        
    </div>
    );
}

export default UsersList;
