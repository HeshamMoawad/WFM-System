import React, { useContext, useEffect, useState } from 'react';
import useRequest from '../../hooks/calls';
import { TargetSlice } from '../../types/auth';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import Container from '../../layouts/Container/Container';
import { useTheme } from '@emotion/react';
import { ModeContext } from '../../contexts/DarkModeContext';
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";


const COLUMNS = [
    { label: "min-value",resize:true, renderCell: (item:TargetSlice) => item.min_value },
    { label: "max-value",resize:true, renderCell: (item:TargetSlice) => item.max_value},
    { label: "money",renderCell: (item:TargetSlice) => (item.money + (item.is_money_percentage ? "%" :" EGP")) },
  ];

const TargetSlicesView = () => {
    const [departments,setDepartments] = useState<string[]>()
    const {mode} = useContext(ModeContext);

    const theme = {...getTheme(),
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
            font-size:1rem;
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
        border-radius:10px;
        text-align:center;
        `,
        Body:"border-radius:10px;",
        };

    const {data , loading} = useRequest<TargetSlice>({url:"api/commission/target-slices",method:"GET",params:{
        page_size:1000
    }},[])
    useEffect(()=>{
        setDepartments([...new Set(data?.results.map((t,i,a)=>t.department.name))])
    },[data])

    return (
        <div className='flex flex-col md:grid md:grid-cols-3 gap-3 mb-2 items-center'>
            <label className='col-span-3 block text-center  text-4xl font-bold'>Global Targets</label>
            {
                loading ? <LoadingComponent/> : null
            }
            {
                departments ? departments.map((department,index,arr)=>{
                    return <Container className='col-span-1'>
                                <label className='block text-center text-primary text-2xl font-bold'>{department}</label>
                                <CompactTable
                                    columns={COLUMNS}
                                    data={{nodes: data?.results.filter((target,index,arr)=>target.department.name === department && target.is_global).sort((a,b)=>a.min_value-b.min_value)}}
                                    theme={theme}
                                    // layout={{  }}
                                />
                            </Container>
                }) : null
            }

        </div>
    );
}

export default TargetSlicesView;
