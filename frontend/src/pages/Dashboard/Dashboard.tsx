import { type FC } from 'react';
import AttendCard from '../../components/AttendCard/AttendCard';
import LateSpeedoMeter from '../../components/LateSpeedoMeter/LateSpeedoMeter';
import { useAuth } from '../../hooks/auth';
import Stats from '../../components/Stats/Stats';
// import Container from '../../layouts/Container/Container';
// import ReactSpeedometer from "react-d3-speedometer";

interface DashBoardProps {}

const DashBoard: FC<DashBoardProps> = () => {
    const {auth} = useAuth()
    return (
        <div className='flex flex-col md:flex-row justify-center mt-3 w-screen'>
            <AttendCard/>
            <div className='flex flex-col justify-center items-center'>
                <div className='text-2xl font-bold text-center'>Statistics</div>
                <Stats/>
                <LateSpeedoMeter date={new Date()} userID={auth.uuid}/>
            </div>
        </div>
    );
}

export default DashBoard;
