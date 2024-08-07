import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import EditLoginInfo from '../../components/EditLoginInfo/EditLoginInfo';
import CommissionDetailsForm from '../../components/CommissionDetailsForm/CommissionDetailsForm';

interface EditUserProps {}

const EditUser: FC<EditUserProps> = () => {
    const {user_uuid} = useParams()
    return (
    <div className='edit-user flex flex-col justify-center items-center'>
        {
            user_uuid ? (
                <>
                    <EditLoginInfo uuid={user_uuid}/>
                    <CommissionDetailsForm user_uuid={user_uuid}/>
                </>
            ):null // not found page
        }
        
    </div>
    );
}

export default EditUser;
