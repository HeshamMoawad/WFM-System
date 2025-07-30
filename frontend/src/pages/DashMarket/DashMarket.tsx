import { useContext, useEffect, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import DatePicker from "react-datepicker";
import { MdOutlineClear } from "react-icons/md";
import { sendRequest } from "../../calls/base";
import { User } from "../../types/auth";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { ModeContext } from "../../contexts/DarkModeContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Doughnut , Line ,Bar , Chart} from 'react-chartjs-2';
import { Chart as ChartJS} from 'chart.js';


interface DashMarketProps {}

interface LeadReport {
    projects: { [k: string]: { name: string; total: number , color:string } };
    users:User[]
    total: number;
}
const COLUMNS = [
    { label: "username", renderCell: (item:User) => item.username },
    { label: "count", renderCell: (item:User) => item.total,sort: { sortKey: "COUNT" },},
  ];

const DashMarket: FC<DashMarketProps> = () => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [projectsData, setProjectsData] = useState<LeadReport | null>(null);
    const [average, setAverage] = useState<number>(0);
    const [search, setSearch] = useState("");
    const {mode} = useContext(ModeContext);
    const [dateType, setDateType] = useState<"MM-yyyy"|"dd-MM-yyyy">("MM-yyyy")
    let data = { nodes:projectsData ? projectsData.users : [] };

    const sort = useSort(
        {nodes:projectsData ? projectsData.users.map((value,index,array)=>{return {...value , id:value.uuid}}) : []},
        {onChange:(arg:any,state:any)=>console.log(arg,state)},
        {
          sortFns: {
            COUNT: (nodess:any) => nodess.sort((a:any, b:any) => (a.total ? a.total : 0) - (b.total ? b.total : 0)),
          },
        }
      );
    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      };
    
        data = {
            nodes: projectsData?.users?.filter((item:User) =>
            item.username.toLowerCase().includes(search.toLowerCase())
        ) ?? [],
      };
    
    const theme = useTheme({...getTheme(),
        Cell:`background-color:${mode ? "#1f2f3e" : "#fff"};color:${mode ? "#fff" : "black"};`,
        HeaderCell: `
            div:has(#svg-icon-chevron-single-up-down) {
                text-align: center;
                justify-content:center;
            }
            /*#svg-icon-chevron-single-up-down{
                display:none;
                }*/
            color:rgb(81 201 201);
            text-align: center;
            font-size:1.5rem;
            background-color: ${mode ? "#1f2f3e" : "#fff"};
            border-bottom: 1px solid gray;
            height:45px;
            .resizer-handle {
            background-color: ${mode ? "#1f2f3e" : "#fff"};
            }
            .resizer-handle {
                background-color:#1f2f3e ;
            }
            svg,
            path {
            fill: currentColor;
            }
        `,
        Table:`
        height: fit-content;
        max-height:100%;
        width: 104%;
        /*margin-right: -50px;  maximum width of scrollbar */
        /*padding-right: 50px;  maximum width of scrollbar */
        overflow-y: scroll;
        scroll-behavior: smooth;
        border-radius:10px;
        text-align:center;
        scrollbar-width: none;
        --data-table-library_grid-template-columns: 50% minmax(150px, 1fr);
        `,
        Body:"border-radius:10px;",
        BaseCell:"text-center; max-height:40px;min-height:40px;"
        });

    useEffect(() => {
        setLoading(true);
        sendRequest({
            url: "api/users/leads-report",
            method: "GET",
            params: date
                ? {
                      date: `${date.getFullYear()}-${date.getMonth() + 1}${dateType === "MM-yyyy" ? "" : "-" + date.getDate()}`,
                  }
                : undefined,
        })
            .then((data) => {
                setProjectsData(data);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [date]);

    useEffect(()=>{        
        if (projectsData){
            setAverage(projectsData?.users.map((value:User)=> value.total ? value.total : 0).reduce((par:number,a:number)=> par + a ,0 ) / projectsData?.users.filter((value:User)=> value.total ? value.total > 0 : false).length)
        }
    },[projectsData])
    useEffect(()=>{    
        ChartJS.defaults.color = mode ? "#fff" : "#000";
        ChartJS.defaults.borderColor =  "#D3D3D3";
    },[mode])
    return (

        
        <div className="dashboard-market flex flex-col gap-5 items-center">
            {
                loading ? <LoadingPage/> : null
            }
            <div className="flex flex-row items-center justify-evenly w-full">
                <Container className="w-[500px] h-[260px]">
                        {
                            projectsData ? <Line options={{borderColor:"rgba(53, 191, 191,0.3)",plugins:{legend:{display:false}}}} data={{
                            labels:Object.keys(projectsData?.projects),
                            datasets:[
                                {
                                    data: Object.values(projectsData?.projects).map((value:{name:string,total:number})=>value.total),
                                    backgroundColor:Object.values(projectsData?.projects).map((value:{name:string,total:number,color:string})=>"rgba(255, 97, 80,0.95)"),
                                },
                            ]
                        }} />   : null  
                        } 

                    </Container>


                    <Container className="flex flex-col items-center justify-evenly h-56 w-[clamp(300px,50%,500px)] overflow-visible">
                    <div className="flex flex-row justify-evenly w-full items-center" >
                        <select defaultValue={"MM-yyyy"} onChange={(elm)=>{
                            setDateType(elm.currentTarget.value as "MM-yyyy"|"dd-MM-yyyy")
                        }}>
                            <option value={"dd-MM-yyyy"}>Day</option>
                            <option value={"MM-yyyy"}>Month</option>
                        </select>
                        <DatePicker
                            showIcon
                            dateFormat={dateType}
                            name="date"
                            renderMonthContent={(month, shortMonth, longMonth, day) => {
                                const fullYear = new Date(day).getFullYear();
                                const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
                                return <span title={tooltipText}>{shortMonth}</span>;
                            }}
                            toggleCalendarOnIconClick
                            showMonthYearPicker = {dateType === "MM-yyyy"}
                            className="md:w-full text-center text-primary font-bold border border-[gray]"
                            calendarIconClassName="w-4 h-4 p-1 z-20"
                            selected={date}
                            onChange={(date) => {
                                if (date && setDate) {
                                    setDate(date);
                                }
                            }}
                    />
                    <MdOutlineClear
                        className="w-8 h-8"
                        onClick={() => {
                            setDate(null);
                        }}
                    />
                    </div>
                    <div className="p-2 text-center text-5xl font-bold">
                        <label>Total Leads</label>
                        <label className="block text-primary">{projectsData ? projectsData?.total : 0}</label>

                    </div>

                </Container>


                <Container className="w-[350px] h-[350px]">
                    {
                        projectsData ? 
                        <Doughnut className="w-4 h-4" data={{
                            labels:Object.keys(projectsData?.projects),
                            datasets:[
                                {
                                    data: Object.values(projectsData?.projects).map((value:{name:string,total:number})=>value.total),
                                    backgroundColor:Object.values(projectsData?.projects).map((value:{name:string,total:number,color:string})=>value.color),
                                    borderWidth:1
                                },
                            ]
                    }} />   : null  
                    } 

                </Container>


            </div>

            {/* Your DashMarket component code here */}

                {
                projectsData ? (<>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 pr-[1rem] w-full items-center">
                        {Object.keys(projectsData.projects).map(
                            (project: any, index) => (
                                <Container
                                    key={index}
                                    className="p-2 text-center font-bold text-2xl"
                                >
                                    <label className="">
                                        {projectsData.projects[project].name ===
                                        "All"
                                            ? "Digital Market"
                                            : projectsData.projects[project]
                                                  .name}
                                    </label>
                                    <label className="block text-primary">
                                        {projectsData.projects[project].total}
                                    </label>
                                </Container>
                            )
                        )}
                    </div>
                    {/* Add more users details as needed */}
                    <div className="flex flex-row w-full justify-evenly">
                        <div className="overflow-hidden w-[clamp(200px,50%,600px)] h-[500px] rounded-xl max-w-[93vw] transition-all duration-600 rounded-lg shadow-md dark:shadow-[gray] dark:shadow-sm  m-2 px-3 pt-2 hover:-translate-y-1 bg-light-colors-dashboard-secondry-bg dark:bg-dark-colors-dashboard-secondry-bg overflow-auto">
                        <label className="block">
                            Search by username:&nbsp;
                            <input type="text" style={{height:"30px"}} className="mb-2" value={search} onChange={handleSearch} />
                        </label>

                            <CompactTable
                                columns={COLUMNS}
                                data={data}
                                theme={theme}
                                layout={{ fixedHeader: true }}
                                sort={sort}
                            />
                        </div>
                    
                        <Container className="w-[60%] h-[450px] place-self-center">
                            {
                                projectsData ? 
                                <Chart type="line" options={{plugins:{legend:{display:false}}}} data={{
                                    labels:projectsData?.users.map((value:User)=> value.username),
                                    datasets:[
                                        {
                                            type:"bar",
                                            data: projectsData?.users.map((value:User)=> value.total),
                                            backgroundColor: projectsData?.users.map((value:User)=> {
                                                // 35bfbf primary ---- ff6150 secoundry
                                                if (value?.total){
                                                    return value?.total >= average ? "rgba(53, 191, 191,0.7)" : "rgba(255, 97, 80,0.65)";
                                                }
                                                return "#D3D3D3";
                                            }),
                                        },
                                        {
                                            type:"line",
                                            data:projectsData?.users.map((value:User)=> average),
                                            borderColor: projectsData?.users.map((value:User)=>"#35bfbf"),
                                            backgroundColor: projectsData?.users.map((value:User)=> "#35bfbf"),
                                        },
                                    ]
                            }} />   : null  
                            } 

                        </Container>
                </div>

                </>) : null}



        </div>
    );
};

export default DashMarket;
