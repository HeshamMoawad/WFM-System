import type { FC } from 'react';

type Data = string|React.ReactElement


interface TableProps {
    headers:string[],
    data:Data[][],
    className?:string
}

const Table: FC<TableProps> = ({headers , data , className=""}) => {
    return (
    <table  className={`table-auto border-collapse w-full text-center ${className}`}>
        <thead className='uppercase'>
            <tr  key={Math.random()}>
                {
                    headers.map((header)=><th  key={Math.random()} scope="col" className="px-6 py-3 opacity-50 " >{header}</th>)
                }
            </tr>
        </thead>
        <tbody key={Math.random()}>
            {
                data.map((row)=>{

                    return (<>
                    <tr className='p-2 border-t border-[rgba(255,255,255,0.15)]' key={Math.random()}>{
                        row.map((data)=>
                        {
                            return typeof data === 'string' ? <td key={Math.random()} className='px-3 py-1'>{data}</td> : data
                        }
                        )
                        }</tr>

                    </>)
                })
            }
        </tbody>
    
    </table>
    );
}

export default Table;
