import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import AttendanceDetailsTable from '../../components/AttendanceDetailsTable/AttendanceDetailsTable';
import { parseDateFromParams } from '../../utils/converter';
import BasicForm from '../../components/BasicForm/BasicForm';
import { BasicDetails, CommissionDetails } from '../../types/auth';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';
import RequestsTableBasic from '../RequestsTableBasic/RequestsTableBasic';
import AdvancesTable from '../../components/AdvancesTable/AdvancesTable';

interface UserBasicProps {}

const UserBasic: FC<UserBasicProps> = () => {
    const {user_uuid="",date=""} = useParams()
    const [userCommissionDetails,setUserCommissionDetails] = useState<CommissionDetails|null>(null)
    const [basicDetails , setBasicDetails] = useState<BasicDetails|null>(null)
    useEffect(()=>{
        const date_parsed = parseDateFromParams(date)
        const commissionPromise = sendRequest({url:"api/commission/user-commission-details",method:"GET",params:{user__uuid:user_uuid}})
        const detailsPromise = sendRequest({url:"api/commission/basic-details",method:"GET",params:{
            user_commission_details__user__uuid:user_uuid,
            date:`${date_parsed.getFullYear()}-${date_parsed.getMonth()+1}-${date_parsed.getDate()}`
        }})
        Promise.all([commissionPromise, detailsPromise])
        .then(values=>{
            // console.log(values)
            setUserCommissionDetails(values[0]?.results[0])
            setBasicDetails(values[1]?.results[0])

        })
    },[])

    return (
    <>
    <div className='user-basic grid grid-cols-10 gap-3 m-1'>
        {
            userCommissionDetails && user_uuid && date ? (
            <>
                <label className='text-4xl col-span-10 text-center'>Basic | {userCommissionDetails.user.first_name} {userCommissionDetails.user.last_name} | {date} </label>
                <BasicForm basicDetails={basicDetails ? basicDetails : undefined} date={date} userCommissionDetails={userCommissionDetails} className='col-span-3 place-self-center'/>
                <AttendanceDetailsTable className='col-span-7 place-self-center' label='Attendance' date={parseDateFromParams(date)} userID={user_uuid} withDetails={false}/>
                <RequestsTableBasic date={parseDateFromParams(date)} className='col-span-7 w-full col-start-4 place-self-center' user_uuid={userCommissionDetails.user.uuid}/>
                <AdvancesTable className='col-span-7 w-full col-start-4 place-self-center' user_uuid={userCommissionDetails.user.uuid} canDelete={true}/>
            </>
            ) : <LoadingComponent/>
        }
    </div>
    </>
    );
}

export default UserBasic;
