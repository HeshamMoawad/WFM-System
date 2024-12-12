import{ FC, useContext, useState } from 'react';
import Container from '../../layouts/Container/Container';
import { TRANSLATIONS } from '../../utils/constants';
import { LanguageContext } from '../../contexts/LanguageContext';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { sendRequest } from '../../calls/base';
import Swal from 'sweetalert2';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import { Project } from '../../types/auth';
import { useAuth } from '../../hooks/auth';
import { checkPagePermission, checkPermission } from '../../utils/permissions/permissions';


interface AddOldLeadProps {

}
const phoneRegex = /(?:^|\s)[\+]?(?:966|0)?(5\d{8})$/gm

const AddOldLead : FC<AddOldLeadProps> = () => {
    const {lang} = useContext(LanguageContext);
    const {auth} = useAuth()
    const [numbers,setNumbers] = useState<string[]>([])
    const [loading,setLoading] = useState(false)
    const [project,setProject] = useState<string>("*")
    let debounceTimer:NodeJS.Timer;
    return (
        <div className='p-5 flex justify-center w-full items-center'>
            {
                checkPermission(auth,"old_lead") ?
                (
                    <Container className='w-fit p-2 flex flex-col gap-3 justify-evenly items-center text-center'>
                        {
                            loading ? <LoadingComponent/> : <></>
                        }
                        <label className='block text-2xl text-primary'>
                            {TRANSLATIONS.AddOldLead.title[lang]}
                        </label>
                        {
                            checkPermission(auth,"old_admin_lead") ? (
                                <div className='flex flex-row justify-evenly w-full'>
                                    <SelectComponent<Project>
                                        name="project" 
                                        LabelName={TRANSLATIONS.AddUser.form.project[lang]}
                                        url="api/users/project"
                                        selectClassName="col-span-2" 
                                        LabelClassName='place-self-center text-primary text-xl'
                                        config={{value: "uuid",label:"name"}}
                                        moreOptions={[{label:"-",value:"*"}]}
                                        setSelection={setProject}
                                    />
                                </div>
                            ):<></>
                        }
                        <textarea 
                            placeholder={`+9665XXXXXXXX\n9665XXXXXXXX\n05XXXXXXXX\n5XXXXXXXX`} 
                            className='md:min-h-[20rem] md:min-w-[20rem] md:resize outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg'
                            onChange={(e)=>{
                                e.preventDefault()
                                if (e.currentTarget.value !== ""){
                                    const text = e.currentTarget.value
                                    clearTimeout(debounceTimer)
                                    debounceTimer = setTimeout(()=>{
                                        let matchs :string[] = []
                                        let match;
                                        while ((match =phoneRegex.exec(text))!== null){
                                            matchs.push(`966${match[1]}`)                   
                                        }
                                        setNumbers([...new Set(matchs)])
                                    },1000)
                                }
                                else {
                                    clearTimeout(debounceTimer);
                                    setNumbers([])
                                }
                            }}
                            />
                        <div className='flex-flex-col gap-1'>
                            {
                                numbers.map((value,index,arr)=>{
                                    return <span className='block'>{value}</span>
                                })
                            }
                        </div>
                        <button
                            disabled={numbers.length < 1 || project === "*"}
                            onClick={(e) => {
                                e.preventDefault();
                                setLoading(true)
                                sendRequest({
                                    url:"api/users/old-lead",
                                    method:"POST",
                                    headers:{
                                        "Content-Type":"application/json"
                                    },
                                    params:undefined,
                                    data:JSON.stringify({
                                        numbers,
                                        project
                                        })
                                })
                                .then(data=>{
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: `Successfully Deleted ( ${data?.count} ) `,
                                        showConfirmButton: false,
                                        timer: 2000
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
                            }}
                            dir={TRANSLATIONS.Direction[lang]}
                            className="rounded-md p-1 text-xl col-span-3 bg-btns-colors-secondry disabled:bg-[gray] w-full min-w-[80px]"
                        >
                            {TRANSLATIONS.Delete[lang]}  ( {numbers.length} )
                        </button>
                    </Container>

                )
                : null
            }

        </div>
    );
}

export default AddOldLead;
