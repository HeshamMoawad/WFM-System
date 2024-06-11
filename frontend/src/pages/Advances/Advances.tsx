import  {type FC } from 'react';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';
import { useAuth } from '../../hooks/auth';
import AdvanceForm from '../../components/AdvanceForm/AdvanceForm';
// import { Link  } from 'react-router-dom';
interface AdvancesProps {}

const Advances: FC<AdvancesProps> = () => {
    const {auth} = useAuth()
    return (
        <>
            <AdvanceForm />
            <AdvancesTable userID={auth.uuid} date={new Date()} />

        </>
    );
}

export default Advances;
