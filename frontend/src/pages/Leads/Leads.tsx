import type { FC } from 'react';
import LeadForm from '../../components/LeadForm/LeadForm';
import UploadLeads from '../../components/UploadLeads/UploadLeads';
import LeadsTable from '../../components/LeadsTable/LeadsTable';
import { useAuth } from '../../hooks/auth';
import { checkPermission } from '../../utils/permissions/permissions';

interface LeadsProps {

}

const Leads: FC<LeadsProps> = () => {
    const {auth} = useAuth()
    return (
    <div  className='leads-page grid grid-cols-1 md:gap-9 md:grid-cols-9 md:px-5'>
        {
            checkPermission(auth,"add_lead") ?
            <LeadForm />
            :null
        }
        {
            checkPermission(auth,"view_lead") ?
            <LeadsTable/>
            :null
        }
        {
            checkPermission(auth,"upload_lead") ?
            <UploadLeads />
            :null
        }
    </div>
    );
}

export default Leads;
