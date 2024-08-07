import { useState, type FC } from 'react';
import Container from '../../layouts/Container/Container';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import Table from '../Table/Table';
import { convertObjectToArrays, parseFormData } from '../../utils/converter';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

interface UploadLeadsProps {}

const UploadLeads: FC<UploadLeadsProps> = () => {
    const [loading, setLoading] = useState(false);
    const [uploaded , setUploaded] = useState(false)
    const [data,setData] = useState({
        new_count: 0,
        old_count: 0,
        total_count: 0,
    })
    const [rowsData,setRowsData] = useState({results:[]});
    return (
    <Container className='col-span-full w-full md:w-[50%] place-self-center h-fit relative'>
        {
            loading? <LoadingComponent/> : <></>
        }
        <h1 className='text-2xl text-btns-colors-primary text-center w-full'>Upload Leads</h1>
        <form action="" className='grid grid-cols-3 gap-4 my-4' onSubmit={e=>{
            e.preventDefault();
            setLoading(true)
            sendRequest({url:"api/users/save-upload",method:"POST",data:parseFormData(e)})
               .then(response => {
                    console.log("Success", response);
                    const results = response ? response : [];
                    setRowsData({results})
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Successfully Saved",
                        showConfirmButton: false,
                        timer: 500
                    })
                })
               .catch(error => {
                    console.error("Error", error);
                    setRowsData({results:[]})
                    Swal.fire({icon: 'error', title: 'Oops...', text: `Something went wrong!\n${error.message}`,})
                })
                .finally(() => {
                    setLoading(false)
                });
                
        }}>

            <label  className='block cursor-pointer bg-btns-colors-primary col-span-3 h-[40px] rounded-lg text-center text-2xl'>
                Upload Sheet
                <input name='file' type="file" className='hidden' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={e=>{
                    e.preventDefault();
                    setLoading(true)

                    const file = e.target.files
                    const formData = new FormData();
                    if (file?.length) {
                        formData.append("file", file[0]);
                    }
                    sendRequest({url:"api/users/upload-sheet",method:"POST",data:formData})
                        .then(response => {
                            const {new_count=0 , old_count=0 , total_count=0 } = response
                            setData({
                                new_count , old_count , total_count
                            })
                            setUploaded(true);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Successfully Uploaded",
                                showConfirmButton: false,
                                timer: 500
                            })
        
                        })
                        .catch(error => {
                            console.error("Error", error);
                            setUploaded(false);
                            setData({
                                new_count:0 , old_count:0 , total_count:0
                            })

                            Swal.fire({icon: 'error', title: 'Oops...', text: `Something went wrong!\n${error.message}`,})

                        })
                        .finally(() => {
                            setLoading(false)
                        });
        
                    
                    }}/>
            </label>

            <label className='col-span-full text-center'>Total Tracked Numbers : {data.total_count}</label>

            <button type="submit" className='bg-btns-colors-primary disabled:bg-[gray] col-span-3 w-full h-[40px] rounded-lg' disabled={!uploaded} >
                Save
            </button>

        </form>
        {
            rowsData.results.length > 0 ?
            <Table
            headers={["user","phone","date"]}
            className='my-4'
            data={convertObjectToArrays(rowsData?.results,[
                {
                    key: 'user',
                    method: (_) => (_ ? _ : "-"),
                },
                {
                    key: 'phone',
                    method: (_) => (_ ? _ : "-"),
                },
                {
                    key: 'date',
                    method: (_: any) => {
                        if (_) {
                            const date = new Date(_);
                            return `${date.getFullYear()}-${
                                date.getMonth() + 1
                            }-${date.getDate()}`;
                        }

                        return "-";
                    },
                },
            ])}
            
            />:<></>
        }
        

    </Container>
    
);
}

export default UploadLeads;
