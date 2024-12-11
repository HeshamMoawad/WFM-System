import { useContext, useState, type FC } from 'react';
import useRequest from '../../hooks/calls';
import { Team } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Container from '../../layouts/Container/Container';
import Pagination from '../Pageination/Pageination';
import Table from '../Table/Table';
import { convertObjectToArrays } from '../../utils/converter';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../utils/constants';
import { checkPermission } from '../../utils/permissions/permissions';

interface TeamTableProps {}

const TeamTable: FC<TeamTableProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [currentPage,setCurrentPage] = useState(1)
    const {auth} = useAuth()
    const canDelete = checkPermission(auth,"delete_team")
    // const additionalFilter = auth.role === "OWNER" || auth.is_superuser ? {} : {leader__department__name : auth.department.name}
    const {data , loading} = useRequest<Team>({url:"api/commission/team",method:"GET",params:{
        page:currentPage,
    }},[currentPage])

    return (
        <Container className='relative col-span-4 h-fit place-self-center'>
            {
                loading ? <LoadingComponent/> : <></>
            }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>{TRANSLATIONS.Teams.table.title[lang]}</h1>
        {/* Table to display leads */}
        {
            data ?(<>
                <Table 
                    className='my-3' 
                    headers={TRANSLATIONS.Teams.table.headers[lang]}
                    data={convertObjectToArrays(data?.results , [
                        {
                            key: "leader",
                            method: (_) => {
                                const leader = _ as any;
                                return leader?.username || "-";
                            },
                        },
                        {
                            key: "name",
                            method: (_) => (_ ? _ : "-"), 
                        },
                        {
                            key: "agents",
                            method: (_) => {
                                const agents = _ as any;
                                return String(agents?.length) || "0" ;
                            },
                        },
                        {
                            key: "uuid",
                            method: (uuid) => {
                                return (
                                    <td
                                        key={Math.random()}
                                        className="px-3 py-1 w-fit min-w-[120px] flex justify-center items-center"
                                    >
                                        {
                                            canDelete ?
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "You won't be able to revert this!",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#3085d6",
                                                        cancelButtonColor: "#d33",
                                                        confirmButtonText: "Yes, delete it!"
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            sendRequest({
                                                                url: "api/commission/team",
                                                                method: "DELETE",
                                                                params: { uuid },
                                                            })
                                                                .then((data) => {
                                                                    Swal.fire({
                                                                        position:
                                                                            "center",
                                                                        icon: "success",
                                                                        title: "Deleted Successfully",
                                                                        showConfirmButton:
                                                                            false,
                                                                        timer: 1000,
                                                                    })
                                                                })
                                                                .catch((err) => {
                                                                    Swal.fire({
                                                                        position:
                                                                            "center",
                                                                        icon: "error",
                                                                        title: "can't Deleted",
                                                                        showConfirmButton:
                                                                            false,
                                                                        timer: 1000,
                                                                    });
                                                                });
                                                                }
                                                            });                

                                                    
                                                }}
                                                className="rounded-md bg-btns-colors-secondry w-2/3"
                                            >
                                                {TRANSLATIONS.Delete[lang]}
                                            </button>
                                            :null
                                        }
                                    </td>
                                );
                            },
                        }
                    ])}
                />
                <Pagination currentPage={currentPage} page={data} setCurrentPage={setCurrentPage} />
                <div  className={`mb-2 rounded-md flex flex-row items-center justify-evenly bg-light-colors-dashboard-third-bg dark:bg-dark-colors-login-third-bg md:w-full`}>
                    <label htmlFor="" className='text-center'>Total : {data?.total_count}</label>
                </div>

            </>):<></>
        }


        </Container>
    );
}

export default TeamTable;
