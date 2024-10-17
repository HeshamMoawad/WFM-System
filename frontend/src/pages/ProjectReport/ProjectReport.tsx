import { useContext, useEffect, useState, type FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sendRequest } from '../../calls/base';
import LoadingPage from '../LoadingPage/LoadingPage';
import { User } from '../../types/auth';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
} from "@table-library/react-table-library/table";
import { ModeContext } from "../../contexts/DarkModeContext";
import CustomTableRow from '../../components/CustomTableRow/CustomTableRow';
import DatePicker from 'react-datepicker';

interface ProjectReportProps {}

const ProjectReport: FC<ProjectReportProps> = () => {
    const {project_uuid} = useParams()
    const {mode} = useContext(ModeContext)
    const theme = useTheme({...getTheme(),
        Cell:`background-color:${mode ? "#1f2f3e" : "#fff"};color:${mode ? "#fff" : "black"};`,
        HeaderCell: `
            font-weight: bold;
            /*border-bottom: 1px solid gray;*/
            color:${mode ? "#fff" : "black"};
            text-align: center;
            background-color: ${mode ? "#1f2f3e" : "#fff"};
            border-bottom: 1px solid gray;
            .resizer-handle {
            background-color: ${mode ? "#1f2f3e" : "#fff"};
            }
            svg,
            path {
            fill: currentColor;
            }
        `,
        Table:"border-radius:5px;row-gap:10px;column-gap:0px;",
        Body:"border-radius:5px;",
        Header:"border-radius:5px;",
        Row: ``,
        });

    const [agents,setAgents] = useState<User[]>([])
    const [loading,setLoading] = useState<boolean>(false)
    const [date,setDate] = useState(new Date())
    useEffect(()=>{
        setLoading(true)
        sendRequest({url:"api/users/get-reports" , method:"GET" , params:{project:project_uuid,date:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}})
        .then((data)=>{
            setAgents(data.results)
        })
        .finally(()=>{
           setLoading(false) 
        })
    },[date])
    return (
        <div className='p-10 flex flex-col gap-8 text-center'>
        {
            loading ? <LoadingPage/> : 
            <>
                <h1 className='text-center text-3xl font-bold'>Agents</h1>
                <DatePicker
                    className='text-center'
                    dateFormat={"yyyy-MM-dd"}
                    selected={date}
                    onChange={(d:Date|null) => d ? setDate(d) : null}
                    />

                {/* Add your reports here */}

                <Table data={{nodes:agents}} theme={theme}>
                    {(tableList: any) => (
                        <>
                            <Header>
                                <HeaderRow>
                                    <HeaderCell>Username</HeaderCell>
                                    <HeaderCell>Project</HeaderCell>
                                    <HeaderCell>Department</HeaderCell>
                                    <HeaderCell>All</HeaderCell>
                                    <HeaderCell>Twitter</HeaderCell>
                                    <HeaderCell>Tiktok</HeaderCell>
                                    <HeaderCell>Whatsapp</HeaderCell>
                                    <HeaderCell>Telegram</HeaderCell>
                                    <HeaderCell>Jaco</HeaderCell>
                                </HeaderRow>
                            </Header>
                            <Body>
                                {tableList.map(
                                    (item: User, index: number, all: Array<any>) => (<CustomTableRow item={item}/>)
                                )}
                            </Body>
                        </>
                    )}
                </Table>
            
            </>
        }

    </div>
    );
}

export default ProjectReport;
