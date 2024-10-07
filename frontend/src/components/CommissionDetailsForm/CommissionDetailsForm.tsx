import { useContext, useEffect, useState, type FC } from "react";
import Container from "../../layouts/Container/Container";
import SelectComponent from "../SelectComponent/SelectComponent";
import { DeductionRules, TargetSlice } from "../../types/auth";
import { CommissionDetails } from "../../types/auth";
import { sendRequest } from "../../calls/base";
import Swal from "sweetalert2";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { Convert  } from "../../utils/converter";
import { LanguageContext } from "../../contexts/LanguageContext";
import { TRANSLATIONS } from "../../utils/constants";

interface CommissionDetailsFormProps {
    user_uuid: string;
}

const CommissionDetailsForm: FC<CommissionDetailsFormProps> = ({
    user_uuid,
}) => {
    const {lang} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false);
    const [currentCommissionDetails, setCurrentCommissionDetails] = useState<CommissionDetails|null>(null);
    const onChange = (event: any) => {
        setCurrentCommissionDetails((prev) => {
            if (prev) {
                return {
                   ...prev,
                    [event.target.name]: event.target.value,
                };
            }
            return null;
        });
    };
    useEffect(()=>{
        setLoading(true)

        sendRequest({
            url:`api/commission/user-commission-details`,
            method:"GET",
            params:{user:user_uuid}
        })
            .then(data=>{
                setCurrentCommissionDetails(Convert(data?.results[0],["deduction_rules", "commission_rules"]));
            })
            .catch(error=>{
                setCurrentCommissionDetails(null);
            })
            .finally(()=>{
                setLoading(false)
            })
    },[user_uuid])

    return (
        <Container className="w-[50rem]">
            {
                loading ? <LoadingComponent/> : <></>
            }
            {
                currentCommissionDetails ? (<>
                    <h1 className="text-2xl md:text-3xl text-center text-btns-colors-primary">
                        {TRANSLATIONS.AddUser.commissionform.title[lang]}
                    </h1>

                    <form
                        className="p-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const deduction_rules_element = e.currentTarget.elements.namedItem("deduction_rules") as HTMLSelectElement;
                            const deduction_rules_values = Array.from(
                                deduction_rules_element.selectedOptions,
                                (option) => option.value
                            );

                            const commission_rules_element = e.currentTarget.elements.namedItem("commission_rules") as HTMLSelectElement;
                            const commission_rules_values = Array.from(
                                commission_rules_element.selectedOptions,
                                (option) => option.value
                            );
                            const updated_data = {
                                ...currentCommissionDetails,
                                    deduction_rules: deduction_rules_values,
                                    commission_rules: commission_rules_values,
                            }
                            // console.log(updated_data);
                            sendRequest({
                                url:"api/commission/user-commission-details" , 
                                method:"PUT",
                                params:{uuid:updated_data.uuid},
                                data:JSON.stringify(updated_data),
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(data=>{
                                    Swal.fire({
                                        position: "center",
                                        icon: "success",
                                        title: "Updated Successfully",
                                        showConfirmButton: false,
                                        timer: 1000
                                    })
                                })
                                .catch(error =>{
                                    Swal.fire({
                                        icon: "error",
                                        title: "can't Update",
                                        showConfirmButton: false,
                                        timer: 1000
                                    })
                                })
                        }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                            <label htmlFor="basic">{TRANSLATIONS.AddUser.commissionform.basic[lang]}</label>
                            <input
                                type="number"
                                value={currentCommissionDetails.basic}
                                onChange={onChange}
                                name="basic"
                                id="basic"
                                min={10}
                                required
                                className="col-span-2 md:col-span-5 w-[100%] md:w-[50%]  place-self-center outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg"
                            />

                            <label
                                htmlFor="set_deduction_rules"
                                className="col-span-2 md:col-span-2 place-self-center"
                            >
                                {TRANSLATIONS.AddUser.commissionform.setdeduction[lang]}
                            </label>
                            <input
                                type="checkbox"
                                checked={currentCommissionDetails.set_deduction_rules}
                                onChange={(e) => {
                                    setCurrentCommissionDetails((prev) => {
                                        if (prev){
                                            return {
                                                ...prev,
                                                [e.target.name]: e.target.checked,
                                            };

                                        }
                                        return null;
                                    });
                                }}
                                name="set_deduction_rules"
                                id="set_deduction_rules"
                                className="col-span-1 md:col-auto"
                            />

                            <label
                                htmlFor="set_global_commission_rules"
                                className="col-span-2 md:col-span-2 place-self-center"
                            >
                                {TRANSLATIONS.AddUser.commissionform.setcommission[lang]}
                            </label>
                            <input
                                type="checkbox"
                                checked={
                                    currentCommissionDetails.set_global_commission_rules
                                }
                                onChange={(e) => {
                                    setCurrentCommissionDetails((prev) => {
                                        if (prev){
                                            return {
                                                ...prev,
                                                [e.target.name]: e.target.checked,
                                            };
                                        }
                                        return null;
                                    });
                                }}
                                name="set_global_commission_rules"
                                id="set_global_commission_rules"
                                className="col-span-1 md:col-auto "
                            />

                            <section className="col-span-3 md:col-span-6 grid grid-cols-2">
                                <SelectComponent<DeductionRules>
                                    name="deduction_rules"
                                    LabelName={TRANSLATIONS.AddUser.commissionform.deductionrules[lang]}
                                    url="api/commission/deduction-rules"
                                    params={{"is_global":"False"}}
                                    LabelClassName="place-self-center"
                                    multiple={true}
                                    selectClassName="w-[150px] md:w-[250px] rounded-lg overflow-auto"
                                    selected={currentCommissionDetails.deduction_rules as string[]}
                                    config={{
                                        value: "uuid",
                                        label: ["late_time", "deduction_days"],
                                        method:(...args:any[])=> ` ${(args[0]/60).toPrecision(3)} min , ${args[1]} day `
                                    }}
                                />
                            </section>

                            <section className="col-span-3 md:col-span-6 grid grid-cols-2">
                                <SelectComponent<TargetSlice>
                                    name="commission_rules"
                                    LabelName={TRANSLATIONS.AddUser.commissionform.commissionrules[lang]}
                                    url="api/commission/target-slices"
                                    params={{"is_global":"False"}}
                                    multiple={true}
                                    LabelClassName="place-self-center"
                                    selectClassName="w-[150px] md:w-[250px] rounded-lg overflow-auto"
                                    selected={currentCommissionDetails.commission_rules as string[]}
                                    config={{
                                        value: "uuid",
                                        label: ["min_value", "max_value" , "money" , "is_money_percentage" , "is_global" , "name"],
                                        method:(...args:any[])=> `${args[5]} , ${args[0]} , ${args[1]} , ${args[2]} ${args[3] ? "%" : "EGP" } , ${args[4] ? "Global" :""}`

                                    }}
                                />
                            </section>

                            <label htmlFor="will_arrive_at" className="place-self-center">{TRANSLATIONS.AddUser.commissionform.arrive[lang]}</label>
                            <input
                                type="time"
                                value={currentCommissionDetails.will_arrive_at}
                                onChange={onChange}
                                name="will_arrive_at"
                                id="will_arrive_at"
                                className="col-span-2 outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg"
                            />

                            <label htmlFor="will_leave_at" className="place-self-center">{TRANSLATIONS.AddUser.commissionform.leave[lang]}</label>
                            <input
                                type="time"
                                value={currentCommissionDetails.will_leave_at}
                                onChange={onChange}
                                name="will_leave_at"
                                id="will_leave_at"
                                className="col-span-2  outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg"
                            />

                            <div className="col-span-3 md:col-span-6 flex justify-evenly">
                                <button
                                    // type="submit"
                                    className="bg-btns-colors-secondry w-24 h-7 md:w-36 md:h-10 rounded-lg"
                                >
                                    {TRANSLATIONS.AddUser.commissionform.cancel[lang]}
                                </button>
                                <button
                                    type="submit"
                                    className="bg-btns-colors-primary w-24 h-7 md:w-36 md:h-10 rounded-lg"
                                >
                                    {TRANSLATIONS.AddUser.commissionform.save[lang]}
                                </button>
                            </div>
                        </div>
                    </form>


                </>):<></>
            }
        </Container>
    );
};

export default CommissionDetailsForm;
