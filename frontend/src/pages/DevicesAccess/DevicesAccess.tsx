import { useState, type FC } from 'react';
import AddDevicesForm from '../../components/AddDeviceForm/AddDeviceForm';
import DevicesTable from '../../components/DevicesTable/DevicesTable';

interface DevicesAccessProps {}

const DevicesAccess: FC<DevicesAccessProps> = () => {
    const [refresh, setRefresh] = useState<number>(0)
    return (
        <div className='grid grid-cols-1 justify-items-center'>
            <AddDevicesForm refresh={refresh} setRefresh={setRefresh}/>
            <DevicesTable refresh={refresh} setRefresh={setRefresh}/>
        </div>
    );
}

export default DevicesAccess;
