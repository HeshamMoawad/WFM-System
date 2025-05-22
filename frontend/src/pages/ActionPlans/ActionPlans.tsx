import  {type FC, Suspense, useState } from 'react';
import ActionPlanTable from '../../components/ActionPlanTable/ActionPlanTable';
import ActionPlanForm from '../../components/ActionPlanForm/ActionPlanForm';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface ActionPlansProps {}

const ActionPlans: FC<ActionPlansProps> = () => {
    const [refresh , setRefresh] = useState(false)
    const {auth} = useAuth()
    return (
    <div className='w-full grid grid-cols-1 gap-5 md:grid-flow-row md:grid-cols-9 px-5 '>
        <h1 className='col-span-full text-center text-primary text-3xl font-bold'>Action Plans</h1>
        {
            checkPermission(auth,"add_actionplan") ? <ActionPlanForm setRefresh={setRefresh}  className='md:col-span-full max-w-[400px] md:max-w-[400px] md:min-w-[30rem]  justify-self-center h-fit relative'/> : null
        }
        {
            checkPermission(auth,"view_actionplan") ? <ActionPlanTable refresh={refresh} setRefresh={setRefresh} className='md:col-span-9 place-self-center h-fit min-h-[100px] relative'/> : null
        }
        
    </div>
);
}

export default ActionPlans;
