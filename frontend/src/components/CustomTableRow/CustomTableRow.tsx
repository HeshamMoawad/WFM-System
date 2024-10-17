import { useState, type FC } from 'react';
import {
    Row,
    Cell,
} from "@table-library/react-table-library/table";
import ReportTable from '../ReportTable/ReportTable';
import { useForm } from 'react-hook-form';

interface CustomTableRowProps {
    item: any; // replace with your actual item type
}

const TableRows = {
    twitter : [
        {
            type: "Account_Names",
        },
        {
            type: "Tweets",
        },
        {
            type: "Messages",
        },
        {
            type: "Reply",
        },
        {
            type: "Follow",
        },
    ],
    tiktok : [
        {
            type: "Account_Names",
        },
        {
            type: "Follow",
        },
        {
            type: "Messages",
        },
        {
            type: "Posts",
        },
    ],
    whatsapp : [
        {
            type: "Account_Names",
        },
        {
            type: "Messages",
        },
    ],
    telegram : [
        {
            type: "Account_Names",
        },
        {
            type: "Messages",
        },
    ],
    jaco : [
        {
            type: "Account_Names",
        },
        {
            type: "Messages",
        },
        {
            type: "Follow",
        },
    ]

}

type TableDataType = "twitter"|"tiktok"|"whatsapp"|"telegram"|"jaco";

const CustomTableRow: FC<CustomTableRowProps> = ({item}) => {
    const sended = Object.keys(item.data).length > 1 ? true : false;
    const {register, control } = useForm<any>(
        {
            defaultValues:item.data 
        }
    ); // replace with your actual form hook

    const [expandedData,setExpandedData] = useState<TableDataType|"*">('twitter');
    const [show,setShow] = useState(false);
    const handleToggle = (fieldName:TableDataType|"*") => {
        if (expandedData === fieldName) {
            setShow(!show)
        }else {
            setShow(true)
            setExpandedData(fieldName)
        }
    };

    return (<>
    <Row key={item.uuid} item={{...item,id:item.uuid}} >
        <Cell>{item.user.username}</Cell>
        <Cell>{item.user.project?.name}</Cell>
        <Cell>{item.user.department?.name}</Cell>
        <Cell><label onClick={()=>handleToggle('*')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>All</label></Cell>
        <Cell><label onClick={()=>handleToggle('twitter')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>Twitter</label></Cell>
        <Cell><label onClick={()=>handleToggle('tiktok')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>Tiktok</label></Cell>
        <Cell><label onClick={()=>handleToggle('whatsapp')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>Whatsapp</label></Cell>
        <Cell><label onClick={()=>handleToggle('telegram')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>Telegram</label></Cell>
        <Cell><label onClick={()=>handleToggle('jaco')} className={`${sended ? "text-primary" : "text-btns-colors-secondry"} hover:text-[gold] shadow-xl`}>Jaco</label></Cell>
    </Row>
    {
        show && sended? 
        <>
        <Row key={Math.random()} item={{id:Math.random()}}>
            {
                expandedData === "*" ? Object.keys(TableRows).map((val:string,index:number)=>{
                    return <ReportTable
                    register={register}
                    name={item.user.username}
                    tableType={val}
                    rows={TableRows[val as TableDataType]}
                />

                }) : (
                <>
                <ReportTable
                    register={register}
                    name={item.user.username}
                    tableType={expandedData}
                    rows={TableRows[expandedData]}
                />
                </>
                )
            }

        </Row>
        

        </> : null 
    }
    </>);
}

export default CustomTableRow;
