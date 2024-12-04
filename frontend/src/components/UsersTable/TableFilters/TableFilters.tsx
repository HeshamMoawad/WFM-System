import { SetStateAction, useContext, useState, type FC } from 'react';
import SelectComponent from '../../SelectComponent/SelectComponent';
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Filters } from '../../../types/auth';
import { LanguageContext } from '../../../contexts/LanguageContext';
import { TRANSLATIONS } from '../../../utils/constants';

interface TableFiltersProps {
    setFilters:React.Dispatch<SetStateAction<Filters>>;
    className?:string;
    others?:boolean
}

const TableFilters: FC<TableFiltersProps> = ({setFilters , className , others = true}) => {
    const {lang} = useContext(LanguageContext)
    const [refresh , setRefresh] = useState<boolean>(false)
    // 'flex flex-row w-[1000px] md:w-full gap-3 justify-evenly md:px-16'
    return (
    <div className={className}>
        <input type="text" className='mr-3' placeholder='Search' onChange={e=>{
                setFilters(prev => ({...prev, username__contains: e.target.value}))
            }} />
        {
            others ? 
            <>
            <div className='w-full flex justify-evenly gap-3 items-center'>
                <SelectComponent 
                    url='api/users/department'
                    LabelName={TRANSLATIONS.UsersList.filters.department[lang]}
                    config={{label: 'name' , value: 'uuid'}}
                    name='user'
                    setSelection={(department__uuid:string)=>{
                        if (department__uuid === "*"){
                            setFilters(prev => {
                                const { department__uuid ,...newFilters } = prev;
                                return newFilters;
                            })
                        }else {
                            setFilters(prev => ({...prev, department__uuid}))
                        }
                    }}
                    moreOptions={[{label:"All",value:"*"}]}
                    refresh={refresh}
                    />
            </div>

            <div className='w-full flex justify-evenly gap-3 items-center'>
                <SelectComponent 
                    url='api/users/project'
                    LabelName={TRANSLATIONS.UsersList.filters.project[lang]}
                    config={{label: 'name' , value: 'uuid'}}
                    name='project'
                    setSelection={(project__uuid:string)=>{
                        if (project__uuid === "*"){
                            setFilters(prev => {
                                const { project__uuid , ...newFilters } = prev;
                                return newFilters;                
                            })
                        }else {
                            setFilters(prev => ({...prev, project__uuid}))
                        }
                    }}
                    moreOptions={[{label:"All",value:"*"}]}
                    refresh={refresh}
                    />
            </div>

            <div className='w-full flex justify-evenly gap-3 items-center'>
            <SelectComponent 
                url='api/users/role'
                LabelName={TRANSLATIONS.UsersList.filters.role[lang]}
                config={{label: 'name' , value: 'uuid'}}
                name='role'
                moreOptions={[
                    {label:"All",value:"*"},
                    {label:"Agent",value:"AGENT"},
                    {label:"Manager",value:"MANAGER"},
                    {label:"HR",value:"HR"},
                ]}
                setSelection={(role:string)=>{
                    if (role === "*"){
                        setFilters(prev => {
                            const { role , ...newFilters } = prev;
                            return newFilters;                
                        })
                    }else {
                        setFilters(prev => ({...prev, role}))
                    }
                }}
                />
            
            </div>
            <button className='w-[100px]' onClick={(e)=>{
                setFilters({})
                setRefresh(prev => !prev)
                }}><FaFilterCircleXmark className='w-7 h-7 fill-btns-colors-secondry'/></button>
            </>: null
        }

    </div>
);
}

export default TableFilters;
