import { useContext, useState, type FC } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";
import AddUserForm from "../../components/AddUserForm/AddUserForm";
import CommissionDetailsForm from "../../components/CommissionDetailsForm/CommissionDetailsForm";
import { CommissionDetails } from "../../types/auth";
import { useAuth } from "../../hooks/auth";
import { checkPermission } from "../../utils/permissions/permissions";

interface AddUserProps {

}

const AddUser: FC<AddUserProps> = () => {
    // const {lang} = useContext(LanguageContext);
    const [uuid,setUUID] = useState<string|null>(null);
    const {auth} = useAuth()
    if (checkPermission(auth,"add_user")){
        return (
            <div className="add-user flex flex-col md:flex-row justify-center items-center">
                <AddUserForm setUUID={setUUID}/>
                {
                    uuid ? (
                        <CommissionDetailsForm user_uuid={uuid}/>
                    ): null
                }
            </div>
        );
    }
    return <></>
};

export default AddUser;
