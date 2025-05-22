import { useContext, useState, type FC } from "react";
// import Container from "../../layouts/Container/Container";
import TotalTreasury from "../../components/TotalTreasury/TotalTreasury";
import TreasuryForm from "../../components/TreasuryForm/TreasuryForm";
import { useAuth } from "../../hooks/auth";
import TreasuryTable from "../../components/TreasuryTable/TreasuryTable";
import { TRANSLATIONS } from "../../utils/constants";
import { LanguageContext } from "../../contexts/LanguageContext";
import { checkPermission } from "../../utils/permissions/permissions";

interface TreasuryProps {

}     

const Treasury: FC<TreasuryProps> = () => {
    const [refresh,setRefresh] = useState<boolean>(false);
    const {auth} = useAuth()
    const {lang} = useContext(LanguageContext)
    return (
        <div className="treasury flex flex-col md:grid md:grid-cols-4 gap-5 place-items-start md:p-3">
            <div className="col-span-4 w-full flex justify-center items-center">
                {
                    checkPermission(auth,"view_total_treasury") ? <TotalTreasury refresh={refresh} setRefresh={setRefresh}/> : null
                }
                
            </div>
            <div className="flex flex-col justify-center items-center col-span-2 w-full">
                {   
                    checkPermission(auth,"add_treasuryoutcome") ?
                    <TreasuryForm group setRefresh={setRefresh} header={TRANSLATIONS.Treasury.outform.title[lang]} creator_uuid={auth?.uuid} color="btns-colors-secondry"  url="api/treasury/treasury-outcome"/>
                    : null
                }
                {
                    checkPermission(auth,"view_treasuryoutcome") ?
                    <TreasuryTable refresh={refresh} setRefresh={setRefresh}  color="btns-colors-secondry" label={TRANSLATIONS.Treasury.outtable.title[lang]} url="api/treasury/treasury-outcome" />
                    : null
                }
            </div>
            <div className="flex flex-col justify-center items-center col-span-2 w-full">
                {   
                    checkPermission(auth,"add_treasuryincome") ?
                    <TreasuryForm setRefresh={setRefresh} header={TRANSLATIONS.Treasury.inform.title[lang]} color="btns-colors-primary" creator_uuid={auth?.uuid} url="api/treasury/treasury-income"/>
                    : null
                }
                {
                    checkPermission(auth,"view_treasuryincome") ?
                    <TreasuryTable refresh={refresh} setRefresh={setRefresh}  color="btns-colors-primary" label={TRANSLATIONS.Treasury.intable.title[lang]} url="api/treasury/treasury-income" />
                    : null
                }
            </div>
        </div>
    );
};

export default Treasury;
