import React, { useContext, useState } from "react";
import useRequest from "../../hooks/calls";
import { TargetSlice, Team, User } from "../../types/auth";
import LoadingPage from "../LoadingPage/LoadingPage";
import Container from "../../layouts/Container/Container";
import { useTheme } from "@emotion/react";
import { ModeContext } from "../../contexts/DarkModeContext";
import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import TargetSlicesView from "../../components/TargetSlicesView/TargetSlicesView";
import Swal from "sweetalert2";
import { sendRequest } from "../../calls/base";
import { TRANSLATIONS } from "../../utils/constants";
import { LanguageContext } from "../../contexts/LanguageContext";
import { checkPermission } from "../../utils/permissions/permissions";
import { useAuth } from "../../hooks/auth";

const COLUMNS = [
    { label: "username", renderCell: (item: User) => item.username },
    { label: "department", renderCell: (item: User) => item.department.name },
    { label: "project", renderCell: (item: User) => item.project.name },
];
const COLUMNSCOMMISSION = [
    { label: "min-value", renderCell: (item: TargetSlice) => item.min_value },
    { label: "max-value", renderCell: (item: TargetSlice) => item.max_value },
    {
        label: "money",
        renderCell: (item: TargetSlice) =>
            item.money + (item.is_money_percentage ? "%" : " EGP"),
    },
    // { label: "is_percentage", renderCell: (item:TargetSlice) => <input type='checkbox' disabled checked={item.is_money_percentage} />},
];

const TeamDetails = () => {
    const { mode } = useContext(ModeContext);
    const { lang } = useContext(LanguageContext);
    const { auth } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const theme = {
        ...getTheme(),
        Cell: `background-color:${mode ? "#1f2f3e" : "#fff"};color:${
            mode ? "#fff" : "black"
        };`,
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
        Table: `
        height: fit-content;
        border-radius:10px;
        text-align:center;

        `,
        Body: "border-radius:10px;",
    };
    const { data, loading } = useRequest<Team>(
        {
            url: "api/commission/team",
            method: "GET",
            params: {
                page_size: 1000,
            },
        },
        [refresh]
    );
    const canDelete = checkPermission(auth, "delete_team");
    return (
        <div className="p-5">
            {loading ? <LoadingPage /> : null}
            <TargetSlicesView />
            <span className="block w-full bg-[gray] h-[1px] my-5"></span>
            {data ? (
                <div className="flex flex-col md:grid md:grid-cols-3 gap-4 place-items-center">
                    <label className="col-span-3 block text-center text-4xl font-bold">
                        Teams Info
                    </label>

                    {data?.results
                        .sort((a, b) => a.agents.length - b.agents.length)
                        .map((team, index, arr) => {
                            return (
                                <Container className="w-full flex flex-col gap-3 h-fit">
                                    <div className="flex flex-row gap-3 justify-between">
                                        <label className="block text-center text-primary text-2xl font-bold w-full">
                                            {team.name}
                                        </label>
                                        {canDelete ? (
                                            <button
                                                className="rounded-md bg-btns-colors-secondry p-1"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "You won't be able to revert this!",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor:
                                                            "#3085d6",
                                                        cancelButtonColor:
                                                            "#d33",
                                                        confirmButtonText:
                                                            "Yes, delete it!",
                                                    }).then((result) => {
                                                        if (
                                                            result.isConfirmed
                                                        ) {
                                                            sendRequest({
                                                                url: "api/commission/team",
                                                                method: "DELETE",
                                                                params: {
                                                                    uuid: team.uuid,
                                                                },
                                                            })
                                                                .then(
                                                                    (data) => {
                                                                        Swal.fire(
                                                                            {
                                                                                position:
                                                                                    "center",
                                                                                icon: "success",
                                                                                title: "Deleted Successfully",
                                                                                showConfirmButton:
                                                                                    false,
                                                                                timer: 1000,
                                                                            }
                                                                        );
                                                                    }
                                                                )
                                                                .catch(
                                                                    (err) => {
                                                                        Swal.fire(
                                                                            {
                                                                                position:
                                                                                    "center",
                                                                                icon: "error",
                                                                                title: "can't Deleted",
                                                                                showConfirmButton:
                                                                                    false,
                                                                                timer: 1000,
                                                                            }
                                                                        );
                                                                    }
                                                                )
                                                                .finally(() =>
                                                                    setRefresh(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            !prev
                                                                    )
                                                                );
                                                        }
                                                    });
                                                }}
                                            >
                                                {TRANSLATIONS.Delete[lang]}
                                            </button>
                                        ) : null}
                                    </div>
                                    <span className="block w-full bg-[gray] h-[1px]"></span>
                                    <label className="block text-center text-xl">
                                        Leader :{" "}
                                        <span className="font-bold">
                                            {team.leader.username}
                                        </span>{" "}
                                        | {team.leader.department.name} |{" "}
                                        {team.leader.project.name}
                                    </label>
                                    <span className="block w-full bg-[gray] h-[1px]"></span>
                                    <>
                                        <label className="block w-full text-center text-xl font-bold">
                                            Agents
                                        </label>
                                        <CompactTable
                                            columns={COLUMNS}
                                            data={{ nodes: team.agents }}
                                            theme={theme}
                                            layout={{ fixedHeader: true }}
                                        />
                                        <span className="block w-full bg-[gray] h-[1px]"></span>
                                        <label className="block w-full text-center text-xl font-bold">
                                            Target Slices
                                        </label>
                                        <CompactTable
                                            columns={COLUMNSCOMMISSION}
                                            data={{
                                                nodes: team.commission_rules.sort(
                                                    (a, b) =>
                                                        a.min_value -
                                                        b.min_value
                                                ),
                                            }}
                                            theme={theme}
                                            layout={{ fixedHeader: true }}
                                        />
                                    </>
                                </Container>
                            );
                        })}
                </div>
            ) : null}
        </div>
    );
};

export default TeamDetails;
