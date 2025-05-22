import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import EditLoginInfo from '../../components/EditLoginInfo/EditLoginInfo';
import CommissionDetailsForm from '../../components/CommissionDetailsForm/CommissionDetailsForm';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';

interface EditUserProps {}

const EditUser: FC<EditUserProps> = () => {
    const {user_uuid} = useParams()
    const {auth}= useAuth()
    if(checkPermission(auth,"change_user") && user_uuid){
    return (
    <div className='edit-user flex flex-col justify-center items-center'>
            <EditLoginInfo uuid={user_uuid}/>
            <CommissionDetailsForm user_uuid={user_uuid}/>
    </div>
    );
    }
    return <></> ;
}

export default EditUser;
