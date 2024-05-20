import { SetStateAction, useState, type FC } from 'react';
import SelectComponent from '../../SelectComponent/SelectComponent';
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Filters } from '../../../types/auth';

interface TableFiltersProps {
    setFilters:React.Dispatch<SetStateAction<Filters>>;
}

const TableFilters: FC<TableFiltersProps> = ({setFilters}) => {
    const [refresh , setRefresh] = useState<boolean>(false)
    return (
    <div className='flex flex-row w-2/3 gap-3 justify-evenly'>
        <div className='w-full flex justify-evenly'>
            <SelectComponent 
                url='api/users/department'
                LabelName='Department'
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


        <div className='w-full flex justify-evenly'>
            <SelectComponent 
                url='api/users/project'
                LabelName='Project'
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

        <div className='w-full flex justify-evenly'>
        <SelectComponent 
            url='api/users/role'
            LabelName='Role'
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
    </div>
);
}

export default TableFilters;
