import { useContext, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import { BasicDetails, Subscription } from "../../types/auth";
import { parseFormData } from "../../utils/converter";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { TotalLeads } from "../TotalLeadsCard/TotalLeadsCard";
import { sendRequest } from "../../calls/base";
import Swal from "sweetalert2";
import { SalaryType } from "../../pages/Salary/Salary";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../contexts/LanguageContext";
import { TRANSLATIONS } from "../../utils/constants";

interface SalaryFormProps extends React.HTMLProps<HTMLDivElement> {
    oldSalary?: SalaryType;
    basic: BasicDetails;
    user_uuid: string;
    date: Date;
    subscriptions?: Subscription[] | null;
    department?: string;
    analytics?: TotalLeads;
}

const SalaryForm: FC<SalaryFormProps> = ({
    className,
    oldSalary,
    basic,
    analytics,
    date,
    subscriptions,
    department,
    user_uuid,
}) => {
    const {lang} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [salary, setSalary] = useState<SalaryType>(
        oldSalary
            ? oldSalary
            : {
                  uuid: "",
                  target: 0,
                  target_Team: 0,
                  plus: 0,
                  american: 0,
                  american_count: 0,
                  subscriptions: 0,
                  deduction: 0,
                  gift: 0,
                  subscriptions_count: 0,
                  ...{ salary: basic ? parseInt(`${basic.basic}`) : 0 },
                  // salary : basic ? parseInt(`${}`) : 0 ,
              }
    );
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSalary((prev) => {
            const newValues = {
                ...prev,
                [e.target.name]: parseFloat(e.target.value),
            };
            const val = Number(
                (basic ? parseInt(`${basic.basic}`) : 0) +
                    newValues.target_Team +
                    newValues.target +
                    newValues.plus +
                    newValues.american +
                    newValues.subscriptions +
                    newValues.gift -
                    newValues.deduction
            );
            return {
                ...newValues,
                salary: Math.round(val),
            };
        });
    };
    const getSubscriptionValue = (count: number, subs: Subscription[]) => {
        for (let index = 0; index < subs.length; index++) {
            const element = subs[index];
            if (element.count === count) {
                return element.value;
            }
        }
        return 0;
    };
    const handleDelete = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                sendRequest({
                    url: `api/commission/salary`,
                    method: "DELETE",
                    params: { uuid : salary.uuid },
                })
                   .then(() => {
                        Swal.fire(
                            "Deleted!",
                            "Salary record has been deleted.",
                            "success"
                        ).then(() => {
                            navigate(-1);
                        });
                    })
                   .catch((error) => {
                        console.error(error);
                        Swal.fire("Error!", error.message, "error")})}})
    }
    return (
        <Container className={`${className} relative w-[500px] h-fit`}>
            {loading ? <LoadingComponent /> : <></>}
            <h1 className="text-2xl text-btns-colors-primary text-center w-full">
                Salary
            </h1>

            <form
                className="grid grid-cols-3 gap-1 my-2 overflow-x-hidden"
                onSubmit={(e) => {
                    e.preventDefault();
                    setLoading(true);
                    const form = parseFormData(e);
                    if (!oldSalary) {
                        form.append(
                            "date",
                            `${date.getFullYear()}-${
                                date.getMonth() + 1
                            }-${date.getDate()}`
                        );
                    }
                    sendRequest({
                        url: "api/commission/salary",
                        method: oldSalary ? "PUT" : "POST",
                        data: form,
                        params: oldSalary
                            ? { uuid: oldSalary.uuid }
                            : undefined,
                    })
                        .then((data) => {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Successfully Gived",
                                showConfirmButton: false,
                                timer: 1000,
                            }).then(() => {
                                navigate(-1);
                            });
                        })
                        .catch((error) => {
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "Faild to Give",
                                showConfirmButton: false,
                                timer: 1000,
                            });
                        })
                        .finally(() => setLoading(false));
                }}
            >
                <input
                    className="hidden"
                    type="text"
                    name="basic"
                    value={basic.uuid}
                />
                <input
                    className="hidden"
                    type="text"
                    name="user"
                    value={user_uuid}
                />

                <label
                    className="col-span-1 place-self-center"
                    htmlFor="target"
                >
                    {TRANSLATIONS.Salary.form.target[lang]}
                </label>
                <input
                    onChange={onChange}
                    value={salary.target}
                    className="mt-1 w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                    type="number"
                    name="target"
                />

                <label
                    className="col-span-1 place-self-center"
                    htmlFor="target_Team"
                >
                    {TRANSLATIONS.Salary.form.targetteam[lang]}
                </label>
                <input
                    onChange={onChange}
                    value={salary.target_Team}
                    className="w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                    type="number"
                    name="target_Team"
                />

                {department === "marketing" ? (
                    <>
                        <label
                            className="col-span-1 place-self-center"
                            htmlFor="plus"
                        >
                            {TRANSLATIONS.Salary.form.plus[lang]}{" "}
                        </label>
                        <input
                            onChange={onChange}
                            value={salary.plus}
                            className="w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                            type="number"
                            name="plus"
                        />

                        <label
                            className="col-span-1 place-self-center"
                            htmlFor="american"
                        >
                            {TRANSLATIONS.Salary.form.american[lang]}
                        </label>
                        <div className="col-span-2 place-self-center flex flex-row justify-center items-center gap-3">
                            <input
                                value={salary.american_count}
                                onChange={(e) => {
                                    setSalary((prev) => {
                                        const newValues = {
                                            ...prev,
                                            american_count: +e.target.value,
                                            american:
                                                +e.target.value *
                                                (analytics
                                                    ? analytics.american_leads_price
                                                    : 1),
                                        };

                                        const val = Number(
                                            (basic
                                                ? parseInt(`${basic.basic}`)
                                                : 0) +
                                                newValues.target_Team +
                                                newValues.target +
                                                newValues.plus +
                                                newValues.american +
                                                newValues.subscriptions +
                                                newValues.gift -
                                                newValues.deduction
                                        );

                                        return {
                                            ...newValues,
                                            salary: val,
                                        };
                                    });
                                }}
                                className="col-span-2 place-self-center w-[20%] outline-none px-1 text-center rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                                type="number"
                                name="american_count"
                            />
                            <input
                                value={salary.american}
                                className="border-none text-center w-[47%] col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                                type="number"
                                name="american"
                            />
                        </div>

                        <label
                            className="col-span-1 place-self-center"
                            htmlFor="subscriptions"
                        >
                            {TRANSLATIONS.Salary.form.subscription[lang]}
                        </label>
                        <div className="col-span-2 place-self-center flex flex-row justify-center items-center gap-3">
                            <input
                                value={salary.subscriptions_count}
                                onChange={(e) => {
                                    setSalary((prev) => {
                                        const newValues = {
                                            ...prev,
                                            subscriptions_count:
                                                +e.target.value,
                                            subscriptions: subscriptions
                                                ? getSubscriptionValue(
                                                      +e.target.value,
                                                      subscriptions
                                                  )
                                                : 0,
                                        };

                                        const val = Number(
                                            (basic
                                                ? parseInt(`${basic.basic}`)
                                                : 0) +
                                                newValues.target_Team +
                                                newValues.target +
                                                newValues.plus +
                                                newValues.american +
                                                newValues.subscriptions +
                                                newValues.gift -
                                                newValues.deduction
                                        );

                                        return {
                                            ...newValues,
                                            salary: val,
                                        };
                                    });
                                }}
                                className="col-span-2 place-self-center w-[20%] outline-none px-1 text-center rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                                type="number"
                                name="subscriptions_count"
                            />
                            <input
                                value={salary.subscriptions}
                                className="border-none text-center w-[47%] col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                                type="number"
                                name="subscriptions"
                            />
                        </div>
                    </>
                ) : null}

                <section className="col-span-full place-self-center grid grid-cols-3 gap-1 border p-2 mt-2 rounded-xl dark:border-[lightgray] border-[darkgray]">
                    <label
                        className="col-span-1 place-self-center"
                        htmlFor="deduction"
                    >
                        {TRANSLATIONS.Salary.form.deduction[lang]}
                    </label>
                    <input
                        onChange={onChange}
                        value={salary.deduction}
                        className="w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-secondry  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                        type="number"
                        name="deduction"
                    />
                    <label
                        className="col-span-1 place-self-center"
                        htmlFor="gift"
                    >
                        {TRANSLATIONS.Salary.form.gift[lang]}
                    </label>
                    <input
                        onChange={onChange}
                        value={salary.gift}
                        className="w-5/6 col-span-2 place-self-center outline-none px-4 rounded-lg border border-btns-colors-primary  bg-light-colors-login-third-bg dark:bg-dark-colors-login-third-bg"
                        type="number"
                        name="gift"
                    />
                </section>

                <label
                    className="col-span-1 place-self-center text-2xl"
                    htmlFor="salary"
                >
                    {TRANSLATIONS.Salary.form.title[lang]} (EGP)
                </label>
                <input
                    value={salary.salary}
                    className="hidden"
                    type="number"
                    name="salary"
                />
                <label className="bg-[transparent] w-full col-span-2 place-self-center text-3xl outline-none border-none text-center">{salary.salary}</label>

                {
                oldSalary ? (
                    <div className="col-span-full flex flex-row-reverse gap-5">
                        <button
                            type="submit"
                            className="col-span- h-10 bg-btns-colors-primary rounded-lg w-2/3 place-self-center my-2"
                        >
                            {TRANSLATIONS.Salary.form.update[lang]}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="col-span-full h-10 bg-btns-colors-secondry rounded-lg w-2/3 place-self-center my-2"
                        >
                            {TRANSLATIONS.Delete[lang]}
                        </button>

                    </div>
                ) : (
                    <button
                        type="submit"
                        className="col-span-full h-10 bg-btns-colors-primary rounded-lg w-2/3 place-self-center my-2"
                    >
                        {TRANSLATIONS.Salary.form.give[lang]}
                    </button>
                )
                }
            </form>
        </Container>
    );
};

export default SalaryForm;
