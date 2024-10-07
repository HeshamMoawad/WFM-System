import type { FC } from 'react';
import LeadForm from '../../components/LeadForm/LeadForm';
import UploadLeads from '../../components/UploadLeads/UploadLeads';
import LeadsTable from '../../components/LeadsTable/LeadsTable';

interface LeadsProps {

}

const Leads: FC<LeadsProps> = () => {
    return (
    <div  className='leads-page grid grid-cols-1 md:gap-9 md:grid-cols-9 md:px-5'>
        <LeadForm />
        <LeadsTable/>
        <UploadLeads />
    </div>
    );
}

export default Leads;
