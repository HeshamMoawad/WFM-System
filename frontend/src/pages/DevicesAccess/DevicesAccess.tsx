import { useState, type FC } from 'react';
import AddDevicesForm from '../../components/AddDeviceForm/AddDeviceForm';
import DevicesTable from '../../components/DevicesTable/DevicesTable';
import { checkPermission } from '../../utils/permissions/permissions';
import { useAuth } from '../../hooks/auth';
import NotFound from '../NotFound/NotFound';

interface DevicesAccessProps {}

const DevicesAccess: FC<DevicesAccessProps> = () => {
    const [refresh, setRefresh] = useState<number>(0);
    const {auth} = useAuth()
    if(checkPermission(auth,"view_fingerprintid")){
        return (
            <div className='grid grid-cols-1 justify-items-center'>
                {
                    checkPermission(auth,"add_fingerprintid") ? <AddDevicesForm refresh={refresh} setRefresh={setRefresh}/> : null
                }
                {
                    checkPermission(auth,"view_fingerprintid") ? <DevicesTable refresh={refresh} setRefresh={setRefresh}/> : null
                }
                
            </div>
        );

    }
    return <NotFound/>
}

export default DevicesAccess;
