import { FC, memo, useState } from "react";
import SelectComponent from "../SelectComponent/SelectComponent";
import { User } from "../../types/auth";

// AddPhoneNumberForm Component
const AddPhoneNumberForm: FC<{
    onAdd: (number: string) => void;
  }> = ({ onAdd }) => {
    const [number, setNumber] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (number.trim()) {
        onAdd(number);
        setNumber("");
      }
    };
    const Selection = memo(
      (props:{project__uuid:string}) => (
        <SelectComponent
            selectClassName='md:w-2/3'
            LabelClassName='text-xl font-bold'
            searchClassName='w-1/3'
            LabelName="User"
            url='api/users/user'
            name='user'
            config={{
                value:"uuid",
                label:"username"
            }}
            params={{is_superuser:"False",is_staff:"False",project__uuid:props.project__uuid}}
        />
      )
    )
    return (
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Selection project__uuid=""/>
        <button 
          type="submit"
          className="bg-[#25D366] text-white px-4 rounded-lg hover:bg-green-500 transition min-w-[40px]"
        >
          Add
        </button>
      </form>
    );
  };
  
  

export default AddPhoneNumberForm;
