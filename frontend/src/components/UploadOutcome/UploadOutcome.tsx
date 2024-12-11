import { useContext, useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
// import { sendRequest } from '../../calls/base';
// import Swal from 'sweetalert2';
import Table from '../Table/Table';
import { convertObjectToArrays, serialDateToJSDate } from '../../utils/converter';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import * as XLSX from "xlsx";
import { TRANSLATIONS } from '../../utils/constants';
import SelectComponent from '../SelectComponent/SelectComponent';
import { Project } from '../../types/auth';
import { LanguageContext } from '../../contexts/LanguageContext';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


interface UploadOutcomeProps {

}

const UploadOutcome: FC<UploadOutcomeProps> = () => {
    const {lang} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [uploadedFile,setUploadedFile] = useState<XLSX.WorkBook|null>(null);
    const [group,setGroup] = useState<string|null>(null)
    const [jsonData,setJsonData] = useState<Record<string,any>[]|[]>([])
    // const [rowsData,setRowsData] = useState({results:[]});
    return (
    <Container className='col-span-full w-full md:w-[50%] place-self-center h-fit relative'>
        {
            loading? <LoadingComponent/> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Upload OutComes</h1>
        <form action="" className='grid grid-cols-3 gap-4 my-4'>
            {
                uploadedFile ? 
                (
                    <button
                    onClick={(e) => {
                        e.preventDefault();
                        setLoading(true)
                        setGroup(null)
                        setJsonData([])
                        setUploadedFile(null)
                        setLoading(false)
                    }}
                    className="rounded-md col-span-3 bg-btns-colors-secondry w-full min-w-[80px]"
                >
                    {TRANSLATIONS.Treasury.outform.clear[lang]}
                </button>

                ) :
                <label  className='block cursor-pointer bg-btns-colors-primary col-span-3 h-[40px] rounded-lg text-center text-2xl'>
                    Upload Sheet
                    <input name='file' type="file" className='hidden disabled:bg-[gray]' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={e=>{
                        e.preventDefault();
                        setLoading(true)
                        if (e.target.files) {
                            const file = e.target.files[0]
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const data_ = new Uint8Array(event.target?.result as ArrayBuffer);
                                const workbook = XLSX.read(data_, { type: "array" });
                                setUploadedFile(workbook)
                                console.log(workbook)
                            };
                            reader.onloadend = (ev)=>{
                                setLoading(false)
                            }
                            reader.readAsArrayBuffer(file);
                        }                    
                        }}/>
                </label>
            }

            <div className='flex flex-row col-span-full justify-evenly'>
                <label className='text-primary text-2xl'>Sheets on Workbook</label>
                <select onChange={(e)=>{
                    if (uploadedFile){
                        const js_data = XLSX.utils.sheet_to_json(uploadedFile?.Sheets[uploadedFile.SheetNames[parseInt(e.currentTarget.value)]])
                        setJsonData(
                            js_data
                                .map((value,index,arr)=>{
                                    const row = (value as Record<string,any>)
                                    row['date'] = serialDateToJSDate(row['التاريخ']) // `${date.getMonth() !== 11 ? date.getFullYear() : date.getFullYear()+1}-${date.getMonth() !== 11 ? date.getMonth() + 1 : 1}-${date.getDate()}`
                                    delete row['التاريخ']
                                    row["details"] = row['المصروفات']
                                    delete row["المصروفات"]
                                    row['amount'] = row['السعر']
                                    delete row['السعر']
                                    row['valid'] = !isNaN(row['date'].getTime())
                                    return row
                            })
                                .filter((value,index,arr)=>{
                                    const row = (value as Record<string,any>)
                                    return row['valid']
                            }) as Record<string,any>[])
                    }
                    }}>
                    {
                        uploadedFile ? uploadedFile.SheetNames.map((sheet,index,arr)=>{
                            return <option className='' value={index}>{sheet}</option>
                        })
                        : null
                    }
                </select>
                <label className='text-primary text-xl text-center'>Records Count : {jsonData?.length}</label>
            </div>
            {
                jsonData.length > 0 ?
                <>
                    <SelectComponent<{name:string,projects:Project[]}>
                        url='api/treasury/projects-group'
                        LabelName={TRANSLATIONS.UsersList.filters.group[lang]}
                        LabelClassName='col-span-1 place-self-center text-xl text-primary w-full text-end'
                        selectClassName={`col-span-2 place-self-center w-2/3`}
                        config={{label: 'name' , value: 'uuid'}}
                        name='group'
                        moreOptions={[{label:"-",value:"*"}]}
                        setSelection={setGroup}
                        />
                    <Table
                        headers={["details","created_at","amount"]}
                        className='col-span-full'
                        data={convertObjectToArrays(jsonData,[
                            {
                                key: 'details',
                                method: (_) => (_ ? _ : "-"),
                            },
                            {
                                key: "date",
                                method: (_: any) => {
                                    if (_) {
                                        const date = new Date(_)
                                        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()-1}`;
                                    }
                                    return "-";
                                },
                            },
                            {
                                key: 'amount',
                                method: (_) => (_ ? _ : "-"),
                            },
                    ])}
                    />
                    <button 
                        type="submit" 
                        className='bg-btns-colors-primary disabled:bg-[gray] col-span-3 w-full h-[40px] text-xl rounded-lg my-2' 
                        disabled={jsonData.length < 0}
                        onClick={(e)=>{
                            e.preventDefault()
                            if (group !== "*" && group !== null){
                                setLoading(true)
                                sendRequest({
                                    url:"api/treasury/outcome-bulk",
                                    method:"POST",
                                    headers:{
                                        "Content-Type":"application/json"
                                    },
                                    params:undefined,
                                    data:JSON.stringify({
                                        group:group,
                                        records:jsonData.map((value,index,arr)=>{
                                            const row = value
                                            Object.keys(row).map((val,ind,ar)=>{
                                                if (val.includes("__E") || val.includes("valid") ){
                                                    delete row[val]
                                                }
                                            })
                                            row['date'] = `${row['date'].getFullYear()}-${row['date'].getMonth() + 1}-${row['date'].getDate()-1}`
                                            return row
                                        })
                                })})
                                .then(data=>{
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Successfully",
                                        showConfirmButton: false,
                                        timer: 1000
                                      }).finally(()=>{
                                        setLoading(false)
                                        navigate("/treasury")
                                      })
                                }).catch(
                                    error => Swal.fire({
                                        title: 'Auto close alert!',
                                        text: error.message,
                                        timer: 2000
                                      })
                                ).finally(() => {
                                    setLoading(false)
                                })                        
    
                            }else {
                                Swal.fire({
                                    title: 'Required Error',
                                    text: "Please Select Group",
                                    timer: 2000
                                  })
                            }
                        }}
                        >
                        Save ( {jsonData.length} )
                    </button>
                </>
                
                :<></>
            }
            
        </form>


    </Container>
    
);
}

export default UploadOutcome;
