import type { FC } from 'react';
import TeamForm from '../../components/TeamForm/TeamForm';
import TeamTable from '../../components/TeamTable/TeamsTable';

interface TeamsProps {}

const Teams: FC<TeamsProps> = () => {
    return (
    <div className='teams grid grid-cols-1 md:grid-cols-6 md:gap-5 px-4'>
        <TeamForm/>
        <TeamTable />
    </div>
    );
}

export default Teams;
