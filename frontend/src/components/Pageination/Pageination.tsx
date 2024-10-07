import type { FC } from 'react';
import React from 'react';
import { GrPrevious , GrNext } from "react-icons/gr";
import { PageinationDetails } from '../../types/base';

interface PaginationProps {
    page:PageinationDetails,
    currentPage:number,
    setCurrentPage:React.Dispatch<React.SetStateAction<number>>,
}

const Pagination: FC<PaginationProps> = ({ page  , currentPage , setCurrentPage}) => {
    
    const nextIsDisabled = page?.next ? false : true ;
    const prevIsDisabled = page?.previous ? false : true ;

    return (
        <div className='flex flex-row justify-center items-end space-x-3 m-1 h-fit relative'>
            <button className='bg-btns-colors-secondry disabled:bg-[transparent] rounded-full p-1' disabled={prevIsDisabled} onClick={e=>{
                e.preventDefault();
                setCurrentPage(prev=>prev-1)
            }}><GrPrevious className='w-[18px] h-[18px] text-center'  /></button>
            <button className='' disabled>{currentPage}</button>

            <button className='bg-btns-colors-primary disabled:bg-[transparent] rounded-full p-1' disabled={nextIsDisabled} onClick={e=>{
                e.preventDefault();
                setCurrentPage(prev=>prev+1)
            }}><GrNext className=' w-[18px] h-[18px] text-center' /></button>
        </div>
    );
}

export default Pagination;
