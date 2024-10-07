import { useContext, useState, type FC } from 'react';
import useRequest from '../../hooks/calls';
import { RequestType } from '../../types/auth';
import { convertObjectToArrays } from '../../utils/converter';
import Table from '../../components/Table/Table';
import Container from '../../layouts/Container/Container';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Pageination from '../../components/Pageination/Pageination';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';

interface RequestsTableBasicProps {
    className:string;
    user_uuid:string;
    date:Date;

}

const RequestsTableBasic: FC<RequestsTableBasicProps> = ({className ,user_uuid, date }) => {
    const {lang} = useContext(LanguageContext)
    const [currentPage,setCurrentPage] = useState(1)
    const {data , loading } = useRequest<RequestType>({
        url:"api/users/request",
        method:"GET",
        params:{
            user__uuid:user_uuid,
            date__gte: `${date.getFullYear()}-${date.getMonth()}-25`,
            date__lte: `${date.getFullYear()}-${date.getMonth()+1}-26`,
            page:currentPage

        }
    },[currentPage])

    return (
        <Container className={`${className}`}>
        {
            loading ? <LoadingComponent/> : <></>
        }

        <div className='flex flex-row justify-between items-center'>
            <label className='text-2xl text-btns-colors-primary'>{TRANSLATIONS.Requests.title[lang]}</label>
        </div>
        {
            data ? (
            <>
                <Table 
                    className='mb-5'
                    key={Math.random()}
                    headers={TRANSLATIONS.Requests.table.headers2[lang]}
                    data={convertObjectToArrays<RequestType>(
                        data.results,
                        [
                            {
                                key:"type",
                                method : null
                            },
                            {
                                key:"status",
                                method : (_)=>{
                                    return <td key={Math.random()} className={`px-3 py-1 ${_ === "PENDING" ?  "text-[rgb(234,179,8)]" : _ === "REJECTED" ? "text-[red]" : _ === "ACCEPTED" ? "text-[green]" : "" }`}>{_}</td>
                                }
                            },
                            {
                                key:"details",
                                method : null
                            },
                            {
                                key:"date",
                                method : (_: any)=> _ ? _ : "-"
                            },
                            {
                                key:"note",
                                method : (_: any)=> _ ? _ : "-"
                            },
                            {
                                key:"created_at",
                                method : (_: any)=> {
                                    if(_ ) {
                                        const date = new Date(_)
                                        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
                                    }
                                    
                                    return "-"
                                }
                            },

                        ]
                    )}
                    />
                    <Pageination currentPage={currentPage} setCurrentPage={setCurrentPage} page={data}/>
                    
            </>
            ): <></>
        }

    </Container>
    );
}

export default RequestsTableBasic;
