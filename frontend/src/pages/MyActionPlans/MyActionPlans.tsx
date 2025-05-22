import type { FC } from 'react';
import ActionPlanTableBasic from '../../components/ActionPlanTableBasic/ActionPlanTableBasic';
import { useAuth } from '../../hooks/auth';

interface MyActionPlansProps {}

const MyActionPlans: FC<MyActionPlansProps> = () => {
    const {auth} = useAuth()
    return (
    <div className='flex justify-center'>
        <ActionPlanTableBasic user_uuid={auth.uuid} />
    </div>
    );
}

export default MyActionPlans;
