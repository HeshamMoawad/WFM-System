import type { FC } from "react";
import Container from "../../layouts/Container/Container";
import useRequest from "../../hooks/calls";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import Table from "../TableCard/Table/Table";
import { convertObjectToArrays, getFullURL } from "../../utils/converter";
import { TreasuryRecord } from "../../types/auth";
import { sendRequest } from "../../calls/base";
import Swal from "sweetalert2";

interface TreasuryTableProps {
    label?: string;
    url: string;
    color?: string;
}

const TreasuryTable: FC<TreasuryTableProps> = ({ label, url, color }) => {
    const { data, loading } = useRequest<TreasuryRecord>(
        {
            url: url,
            method: "GET",
        },
        []
    );
    return (
        <Container className="w-full h-fit relative">
            {loading ? <LoadingComponent /> : <></>}
            <h1 className={`text-2xl text-${color}`}>{label}</h1>

            {data ? (
                <>
                    <Table
                        headers={[
                            "creator",
                            "username",
                            "amount",
                            "details",
                            "delete",
                        ]}
                        data={convertObjectToArrays(data.results, [
                            {
                                key: "creator",
                                method: (_) => {
                                    const item = _ as any;
                                    return (
                                        <td className="flex justify-center items-center">
                                            {item?.profile?.picture ? (
                                                <img
                                                    src={getFullURL(
                                                        item?.profile?.picture
                                                    )}
                                                    alt=""
                                                    className="rounded-full w-[50px] h-[50px]"
                                                />
                                            ) : (
                                                " "
                                            )}
                                        </td>
                                    );
                                },
                            },
                            {
                                key: "creator",
                                method: (_) => {
                                    const item = _ as any;
                                    return item?.username
                                        ? item?.username
                                        : "Admin";
                                },
                            },
                            {
                                key: "amount",
                                method: (_) => {
                                    return <td className="px-3 py-1">{_}</td>;
                                },
                            },
                            {
                                key: "details",
                                method: (_) => {
                                    return <td className="px-3 py-1">{_}</td>;
                                },
                            },
                            {
                                key: ["uuid","from_advance"],
                                method: (args) => {
                                    const {uuid ,from_advance } = args as any;
                                    return (
                                        <td
                                            key={Math.random()}
                                            className="px-3 py-1"
                                        >
                                            {from_advance ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        sendRequest({
                                                            url: url,
                                                            method: "DELETE",
                                                            params: {
                                                                uuid: uuid,
                                                            },
                                                        })
                                                            .then((data) => {
                                                                console.log(
                                                                    data
                                                                );
                                                                Swal.fire({
                                                                    position:
                                                                        "center",
                                                                    icon: "success",
                                                                    title: "Deleted Successfully",
                                                                    showConfirmButton:
                                                                        false,
                                                                    timer: 1000,
                                                                }); //.then(() => setRefresh())
                                                            })
                                                            .catch((err) => {
                                                                console.log(
                                                                    data,
                                                                    err
                                                                );
                                                                Swal.fire({
                                                                    position:
                                                                        "center",
                                                                    icon: "error",
                                                                    title: "can't Deleted",
                                                                    showConfirmButton:
                                                                        false,
                                                                    timer: 1000,
                                                                });
                                                            });
                                                    }}
                                                    className="rounded-md bg-btns-colors-secondry w-2/3"
                                                >
                                                    Delete
                                                </button>
                                            ) : null}
                                        </td>
                                    );
                                },
                            },
                        ])}
                    />
                </>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default TreasuryTable;
