import { useState, type FC } from "react";
// import Container from "../../layouts/Container/Container";
import TotalTreasury from "../../components/TotalTreasury/TotalTreasury";
import TreasuryForm from "../../components/TreasuryForm/TreasuryForm";
import { useAuth } from "../../hooks/auth";
import TreasuryTable from "../../components/TreasuryTable/TreasuryTable";

interface TreasuryProps {

}

const Treasury: FC<TreasuryProps> = () => {
    const [refresh,setRefresh] = useState<boolean>(false);
    const {auth} = useAuth()
    return (
        <div className="treasury flex flex-col md:grid md:grid-cols-4 gap-5 place-items-start md:p-3">
            <div className="col-span-4 w-full flex justify-center items-center">
                <TotalTreasury refresh={refresh} setRefresh={setRefresh}/>
            </div>
            <div className="flex flex-col justify-center items-center col-span-2 w-full">
                <TreasuryForm setRefresh={setRefresh} header="Outcome" creator_uuid={auth.uuid} color="btns-colors-secondry"  url="api/treasury/treasury-outcome"/>
                <TreasuryTable color="btns-colors-secondry" label="Outcome Details" url="api/treasury/treasury-outcome" />
            </div>
            <div className="flex flex-col justify-center items-center col-span-2 w-full">
                <TreasuryForm setRefresh={setRefresh} header="Income" color="btns-colors-primary" creator_uuid={auth.uuid} url="api/treasury/treasury-income"/>
                <TreasuryTable color="btns-colors-primary" label="Income Details" url="api/treasury/treasury-income" />
            </div>
        </div>
    );
};

export default Treasury;
