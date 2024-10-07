import type { FC } from 'react';
import UsersTable from '../../components/UsersTable/UsersTable';

interface UsersListProps {}

const UsersList: FC<UsersListProps> = () => {
    return (
    <div className='users-list flex justify-center'>
        <UsersTable/>
    
    </div>
    );
}

export default UsersList;
