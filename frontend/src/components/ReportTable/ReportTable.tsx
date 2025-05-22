import React, { FC, useContext, useState } from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
} from "@table-library/react-table-library/table";
import { UseFormRegister } from "react-hook-form";
import { ModeContext } from "../../contexts/DarkModeContext";


interface ReportTableProps {
    register: UseFormRegister<any>;
    tableType: string;
    rows: {type: string}[];
    disabled?: boolean;
    name?: string;
    required_indexes?: number[];
    section_ref?: React.RefObject<HTMLElement>;
}

const ReportTable: FC<ReportTableProps> = ({ register , tableType ,name  , rows  , required_indexes=[0], disabled=false}) => {
    const [data, setData] = useState( { nodes:rows } );
    const {mode} = useContext(ModeContext)
    const theme = useTheme({...getTheme(),
        Cell:`background-color:${mode ? "#1f2f3e" : "#fff"};color:${mode ? "#fff" : "black"};`,
        HeaderCell: `
            display:none;
            .resizer-handle {
            background-color: transparent;
            }
            svg,
            path {
            fill: currentColor;
            }
        `,
        Table:"border-radius:10px;",
        Body:"border-radius:10px;",
        });
    const range = (n:number) => Array.from({length: n}, (value, key) => key)
    return (
        <section  className="flex flex-col col-span-full">
            <label className="text-3xl text-center">{tableType.toUpperCase()} - {name}</label>
            <Table data={data} theme={theme} >
                {(tableList: any) => (
                    <>
                    
                        <Header>
                            <HeaderRow>
                                <HeaderCell className="h-0"></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell></HeaderCell>
                            </HeaderRow>
                        </Header>
                        <Body>
                            
                            {tableList.map(
                                (item: any, index: number, all: Array<any>) => {
                                    return (
                                        <Row key={item.id} item={item} >
                                            <Cell>{item.type}</Cell>
                                            {
                                                range(7).map((val)=>(
                                                <>
                                                <Cell >
                                                    <input
                                                        type="text"
                                                        {...register(
                                                            `${tableType.toLowerCase()}.${item.type.toLowerCase()}.${val}`,
                                                            { disabled: disabled  , required : required_indexes ? required_indexes.includes(val) : false}
                                                        )}
                                                        onChange={undefined}
                                                        style={{
                                                            maxWidth: "10rem",
                                                        }}
                                                    />
                                                </Cell>
                                                </>
                                                ))
                                            }
                                        </Row>
                                    );
                                }
                            )}
                        </Body>
                    </>
                )}
            </Table>
        </section>
    );
};

export default ReportTable;
