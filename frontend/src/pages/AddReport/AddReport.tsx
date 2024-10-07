import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../hooks/auth";
import ReportTable from "../../components/ReportTable/ReportTable";
import { useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { sendRequest } from "../../calls/base";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import LoadingPage from "../LoadingPage/LoadingPage";
import { useNavigate } from "react-router-dom";
import { Console } from "console";
import Swal from "sweetalert2";

interface AddReportProps {}

interface SectionProps {
    account_names: string[];
    tweets?: string[];
    messages: string[];
    replies?: string[];
    follow?: string[];
    posts?: string[];
}
type Inputs = {
    twitter: SectionProps;
    tiktok: SectionProps;
    whatsapp: SectionProps;
    telegram: SectionProps;
    jaco: SectionProps;
};

const AddReport: FC<AddReportProps> = () => {
    // const { auth } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const [canReport, setCanReport] = useState(false);
    const {
        register,
        handleSubmit,
        control,
    } = useForm<Inputs>({
        defaultValues: {},
    });
    
    const onSubmit: SubmitHandler<Inputs> = (data, ...args) => {
        setLoading(true);
        sendRequest({
            url: "api/users/add-report",
            method: "POST",
            data: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        })
        .then(response =>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successfully Created Report",
                showConfirmButton: false,
                timer: 1000,
            });
            navigate(-1);
        }).catch(() => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Faild to Create Report",
                showConfirmButton: false,
                timer: 1000,
            });
        })
        .finally(() => {
            setLoading(false);
        });
};
    useEffect(() => {
        sendRequest({ url: "api/users/check-report", method: "GET" })
            .then((json_response) => {
                setCanReport(json_response.canReport);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {loading ? <LoadingPage /> : null}
            {canReport ? (
                <>
                    <form
                        className="flex flex-col items-center"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Report Form */}
                        <ReportTable
                            register={register}
                            tableType="twitter"
                            rows={[
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
                            ]}
                        />
                        <ReportTable
                            register={register}
                            tableType="tiktok"
                            rows={[
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
                            ]}
                        />
                        <ReportTable
                            register={register}
                            tableType="whatsapp"
                            rows={[
                                {
                                    type: "Account_Names",
                                },
                                {
                                    type: "Messages",
                                },
                            ]}
                        />
                        <ReportTable
                            register={register}
                            tableType="Telegram"
                            rows={[
                                {
                                    type: "Account_Names",
                                },
                                {
                                    type: "Messages",
                                },
                            ]}
                        />
                        <ReportTable
                            register={register}
                            tableType="jaco"
                            rows={[
                                {
                                    type: "Account_Names",
                                },
                                {
                                    type: "Messages",
                                },
                                {
                                    type: "Follow",
                                },
                            ]}
                        />
                        <button
                            type="submit"
                            className="bg-btns-colors-primary h-7 md:w-36 md:h-10 rounded-lg mt-4"
                        >
                            Submit
                        </button>
                        <DevTool control={control} />{" "}
                        {/* set up the dev tool */}
                    </form>
                </>
            ) : <>
            
            <div className="flex flex-col justify-evenly h-[50vh] gap-10 items-center text-center">
                <label htmlFor="" className="text-4xl text-primary drop-shadow-xl">Today Report Already Sent ...</label>
                <button className="bg-btns-colors-primary h-8 text-2xl text-center w-40 md:h-14 rounded-lg mt-4" onClick={()=>{
                    navigate(-1)
                }}>Back</button>
                </div>
            </>}
        </>
    );
};

export default AddReport;
