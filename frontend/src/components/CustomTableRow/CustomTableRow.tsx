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

const CustomTableRow: FC<CustomTableRowProps> = ({item}) => {
    const {register, control } = useForm<any>(
        {
            defaultValues:item.data
        }
    ); // replace with your actual form hook

    const [expandedData,setExpandedData] = useState<"twitter"|"tiktok"|"whatsapp"|"telegram"|"jaco">('twitter');
    const [show,setShow] = useState(false);
    const handleToggle = (fieldName:"twitter"|"tiktok"|"whatsapp"|"telegram"|"jaco") => {
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
        <Cell><label onClick={()=>handleToggle('twitter')} className='text-primary hover:text-[gold] shadow-xl'>Twitter</label></Cell>
        <Cell><label onClick={()=>handleToggle('tiktok')} className='text-primary hover:text-[gold] shadow-xl'>Tiktok</label></Cell>
        <Cell><label onClick={()=>handleToggle('whatsapp')} className='text-primary hover:text-[gold] shadow-xl'>Whatsapp</label></Cell>
        <Cell><label onClick={()=>handleToggle('telegram')} className='text-primary hover:text-[gold] shadow-xl'>Telegram</label></Cell>
        <Cell><label onClick={()=>handleToggle('jaco')} className='text-primary hover:text-[gold] shadow-xl'>Jaco</label></Cell>
    </Row>
    {
        show ? 
        <>
        <Row key={Math.random()} item={{id:Math.random()}}>
            <ReportTable
                register={register}
                name={item.user.username}
                tableType={expandedData}
                rows={TableRows[expandedData]}
            />

        </Row>
        

        </> : null 
    }
    </>);
}

export default CustomTableRow;
