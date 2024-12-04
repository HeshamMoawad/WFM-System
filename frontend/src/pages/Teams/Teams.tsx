import type { FC } from 'react';
import TeamForm from '../../components/TeamForm/TeamForm';
import TeamTable from '../../components/TeamTable/TeamsTable';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface TeamsProps {}

const Teams: FC<TeamsProps> = () => {
    const {auth} = useAuth()
    return (
    <div className='teams grid grid-cols-1 md:grid-cols-6 md:gap-5 px-4'>
        {
            checkPermission(auth,"add_team")?
            <TeamForm/>
            :null
        }
        {
            checkPermission(auth,"view_team")?
            <TeamTable />
            :null
        }
    </div>
    );
}

export default Teams;
