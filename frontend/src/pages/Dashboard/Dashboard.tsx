import type { FC } from 'react';
import AttendCard from '../../components/AttendCard/AttendCard';

interface DashBoardProps {}

const DashBoard: FC<DashBoardProps> = () => {
    return (
        <div className='flex justify-center mt-10 w-screen'>
            <AttendCard/>
        </div>
    );
}

export default DashBoard;
